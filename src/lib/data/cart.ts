"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())
  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product.*, *items.variant.*, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
      },
      headers,
      next,
      cache: "no-store",  // Temporarily disable cache to force fresh data
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(countryCode: string) {
  try {
    console.log('Getting cart for country:', countryCode)
    
    // Get region first
    const region = await getRegion(countryCode)
    if (!region) {
      console.error(`Region not found for country code: ${countryCode}`)
      return null
    }
    console.log('Found region:', { id: region.id, countries: region.countries?.map(c => c.iso_2) })

    // Try to get existing cart
    let cart = await retrieveCart()
    console.log('Retrieved cart:', cart ? { 
      id: cart.id, 
      region_id: cart.region_id,
      items_count: cart.items?.length 
    } : 'No cart found')

    const headers = {
      ...(await getAuthHeaders()),
    }

    // Create new cart if none exists
    if (!cart) {
      console.log("Creating new cart for region:", region.id)
      const cartResp = await sdk.store.cart.create(
        { region_id: region.id },
        {},
        headers
      )
      cart = cartResp.cart
      await setCartId(cart.id)
      console.log('Created new cart:', { id: cart.id, region_id: cart.region_id })
      
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    }

    // Update cart if region doesn't match
    if (cart?.region_id !== region.id) {
      console.log("Updating cart region from", cart.region_id, "to", region.id)
      try {
        const updatedCart = await sdk.store.cart.update(
          cart.id,
          { region_id: region.id },
          {},
          headers
        )
        console.log('Updated cart region:', { 
          id: updatedCart.cart.id, 
          new_region: updatedCart.cart.region_id 
        })
        
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
        return updatedCart.cart
      } catch (error) {
        console.error('Error updating cart region:', error)
        // If update fails, create new cart
        const cartResp = await sdk.store.cart.create(
          { region_id: region.id },
          {},
          headers
        )
        cart = cartResp.cart
        await setCartId(cart.id)
        console.log('Created new cart after region update failed:', { 
          id: cart.id, 
          region_id: cart.region_id 
        })
        
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
        return cart
      }
    }

    // Make sure cart has items
    if (cart.items && cart.items.length > 0) {
      console.log('Returning cart with items:', {
        id: cart.id,
        items_count: cart.items.length
      })
      return cart
    }

    // If cart exists but has no items, try to refresh it
    console.log("Cart exists but empty, refreshing:", cart.id)
    const freshCart = await retrieveCart(cart.id)
    console.log('Refreshed cart:', freshCart ? {
      id: freshCart.id,
      items_count: freshCart.items?.length
    } : 'No cart found after refresh')
    
    return freshCart
  } catch (error) {
    console.error("Error in getOrSetCart:", error)
    throw error
  }
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // Get a fresh copy of the cart to avoid race conditions
    const freshCart = await retrieveCart(cart.id)
    if (!freshCart) {
      throw new Error("Cart not found")
    }

    // Check if this variant already exists in the cart
    const existingItem = freshCart.items?.find(item => item.variant_id === variantId)

    let updatedCart
    if (existingItem) {
      // If item exists, update its quantity atomically
      updatedCart = await sdk.store.cart.updateLineItem(
        freshCart.id,
        existingItem.id,
        { quantity: existingItem.quantity + quantity },
        {},
        headers
      )
    } else {
      // If item doesn't exist, create new line item
      updatedCart = await sdk.store.cart.createLineItem(
        freshCart.id,
        {
          variant_id: variantId,
          quantity,
        },
        {},
        headers
      )
    }
    
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
    
    return updatedCart.cart
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async ({cart}) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // First, verify the item still exists
    const currentCart = await retrieveCart(cartId)
    const itemExists = currentCart?.items?.some(item => item.id === lineId)

    if (!itemExists) {
      // If item doesn't exist, just refresh the cart cache
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return
    }

    // If item exists, proceed with deletion
    await sdk.store.cart.deleteLineItem(cartId, lineId, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  } catch (error: any) {
    // If error is "item not found", just refresh cache
    if (error.message?.includes("not found")) {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return
    }
    throw medusaError(error)
  }
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async (response) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return response
    })
    .catch(medusaError)
}

interface PaymentSession {
  id: string;
  provider_id: string;
  data: Record<string, any>;
}

interface PaymentSessionResponse {
  payment_sessions: PaymentSession[];
}

export const initiatePaymentSession = async (
  cart: {
    id: string;
    total: number;
    region?: {
      currency_code?: string;
    }
  },
  paymentData: {
    provider_id: string;
    data?: {
      email?: string;
      metadata?: Record<string, any>;
    };
  }
) => {
  const headers = {
    ...(await getAuthHeaders()),
    'Content-Type': 'application/json'
  }

  try {
    console.log("Initializing payment session for cart:", cart.id)
    
    // Step 1: Create payment sessions for the cart
    const createResponse = await sdk.client.fetch<PaymentSessionResponse>(
      `/store/carts/${cart.id}/payment-sessions`,
      {
        method: "POST",
        headers
      }
    )

    if (!createResponse?.payment_sessions?.length) {
      console.error("Failed to create payment sessions:", createResponse)
      throw new Error("No payment sessions created")
    }

    console.log("Created payment sessions:", createResponse.payment_sessions)

    // Step 2: Select the payment provider
    const selectResponse = await sdk.client.fetch<Response>(
      `/store/carts/${cart.id}/payment-sessions/${paymentData.provider_id}`,
      {
        method: "POST",
        headers
      }
    )

    if (!selectResponse.ok) {
      console.error("Failed to select payment provider:", {
        status: selectResponse.status,
        statusText: selectResponse.statusText
      })
      throw new Error("Failed to select payment provider")
    }

    console.log("Selected payment provider:", paymentData.provider_id)

    // Step 3: Refresh cart to get updated payment session
    const updatedCart = await retrieveCart(cart.id)
    if (!updatedCart) {
      throw new Error("Could not retrieve updated cart")
    }

    const selectedSession = updatedCart.payment_collection?.payment_sessions?.find(
      session => session.provider_id === paymentData.provider_id
    )

    if (!selectedSession) {
      throw new Error("Selected payment session not found")
    }

    console.log("Payment session initialized successfully:", {
      sessionId: selectedSession.id,
      provider: selectedSession.provider_id,
      hasClientSecret: !!selectedSession.data?.client_secret
    })

    return {
      payment_sessions: [selectedSession]
    }
  } catch (error: any) {
    console.error("Payment session initialization error:", error)
    throw new Error(error.message || "Failed to initialize payment")
  }
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async ({cart}) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cart
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //     revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  //   try {
  //     await deleteDiscount(cartId, code)
  //     revalidateTag("cart")
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())
  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch((error) => {
      medusaError(error)
      return null
    })

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()
    removeCartId()
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes?.cart || null
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId();
  const headers = {
    ...(await getAuthHeaders()),
  };
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  };

  return await sdk.client.fetch<{ shipping_options: HttpTypes.StoreCartShippingOption[] }>(
    "/store/shipping-options",
    {
      query: { cart_id: cartId },
      next: next,
      headers: headers,
      cache: "force-cache",
    }
  );
}
