import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

interface PaymentProvider {
  id: string
  name: string
  is_installed: boolean
}

interface PaymentSession {
  id: string
  provider_id: string
  status: string
  data: Record<string, any>
}

// Using Medusa's type directly
type PaymentCollection = HttpTypes.StorePaymentCollection

export async function getPaymentProviders(regionId: string): Promise<PaymentProvider[]> {
  if (!regionId) {
    console.error("getPaymentProviders: Region ID is missing")
    throw new Error("Region ID is required to fetch payment providers")
  }

  try {
    console.log("Fetching payment providers for region:", regionId)
    
    const { payment_providers } = await sdk.client.fetch<{ payment_providers: PaymentProvider[] }>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
      }
    )
    
    if (!payment_providers?.length) {
      console.error("No payment providers found for region:", regionId)
      throw new Error("No payment providers available for this region")
    }

    console.log("Available payment providers:", payment_providers.map(p => ({
      id: p.id,
      name: p.name,
      is_installed: p.is_installed
    })))

    return payment_providers
  } catch (error: any) {
    console.error("Error fetching payment providers:", {
      error: error.message,
      regionId,
      stack: error.stack
    })
    throw new Error(error.message || "Failed to retrieve payment providers")
  }
}

export async function initializePayment(
  cartId: string,
  providerId: string,
  email: string,
  cart: HttpTypes.StoreCart
): Promise<PaymentSession> {
  if (!cartId || !providerId || !email) {
    throw new Error("Cart ID, provider ID, and email are required to initialize payment")
  }

  try {
    // Check if cart has payment collection with retry logic
    let attempts = 0
    let paymentCollection: PaymentCollection | null = null
    while (attempts < 3 && !paymentCollection) {
      paymentCollection = await getPaymentCollection(cartId)
      if (!paymentCollection) {
        // Create payment collection 
        console.log("Creating payment collection for cart:", cartId)
        const response = await sdk.client.fetch<{ payment_collection: PaymentCollection }>(
          `/store/payment-collections`,
          {
            method: "POST",
            body: {
              cart_id: cartId,
            }
          }
        )
        paymentCollection = response.payment_collection
      }
      attempts++
      if (!paymentCollection && attempts < 3) {
        console.log(`Payment collection creation attempt ${attempts} failed, retrying...`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1s before retry
      }
    }

    if (!paymentCollection) {
      throw new Error("Failed to create or retrieve payment collection after multiple attempts")
    }

    // Initialize payment session
    console.log("Initializing payment session for provider:", providerId)
    const { payment_session } = await sdk.client.fetch<{ payment_session: PaymentSession }>(
      `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
      {
        method: "POST",
        body: {
          provider_id: providerId,
          data: {
            email: email,
            ...cart?.billing_address && {
              billing_address: cart.billing_address
            }
          }
        }
      }
    )

    if (!payment_session) {
      throw new Error("Failed to initialize payment session")
    }

    console.log("Payment session initialized:", {
      id: payment_session.id,
      provider: payment_session.provider_id,
      hasClientSecret: !!payment_session.data?.client_secret
    })

    return payment_session
  } catch (error: any) {
    console.error("Error initializing payment:", {
      error: error.message,
      cartId,
      providerId,
      stack: error.stack
    })
    throw new Error(error.message || "Failed to initialize payment")
  }
}

export async function getPaymentCollection(cartId: string): Promise<PaymentCollection | null> {
  if (!cartId) {
    throw new Error("Cart ID is required to fetch payment collection")
  }

  try {
    const { cart } = await sdk.client.fetch<{ cart: HttpTypes.StoreCart }>(
      `/store/carts/${cartId}`, 
      {
        method: "GET"
      }
    )

    if (!cart) {
      throw new Error("Cart not found")
    }

    return cart.payment_collection || null
  } catch (error: any) {
    if (error.message === "Cart not found") {
      return null
    }
    console.error("Error fetching payment collection:", {
      error: error.message,
      cartId,
      stack: error.stack
    })
    throw new Error(error.message || "Failed to fetch payment collection")
  }
}

interface CompletePaymentResponse {
  type: "order" | "cart"
  data?: any
  message?: string
}

export async function completePayment(cartId: string) {
  if (!cartId) {
    throw new Error("Cart ID is required to complete payment")
  }

  try {
    console.log("Completing payment for cart:", cartId)
    const response = await sdk.client.fetch<CompletePaymentResponse>(
      `/store/carts/${cartId}/complete`,
      {
        method: "POST"
      }
    )
    
    if (response.type === "order" && response.data) {
      console.log("Payment completed successfully, order created:", response.data.id)
      return response.data
    }

    throw new Error(
      response.message || 
      "Payment failed. Please check your payment details and try again."
    )
  } catch (error: any) {
    console.error("Error completing payment:", {
      error: error.message,
      cartId,
      stack: error.stack
    })
    throw new Error(
      error.message || 
      "An unexpected error occurred while processing your payment. Please try again."
    )
  }
}

export async function listCartPaymentMethods(regionId: string) {
  if (!regionId) {
    throw new Error("Region ID is required to list payment methods")
  }
  return getPaymentProviders(regionId)
}
