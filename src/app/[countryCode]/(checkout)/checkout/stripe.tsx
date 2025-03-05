"use client"

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "../../../../providers/cart-provider"
import { usePaymentContext } from "@modules/checkout/components/payment/payment-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Make sure to use test mode key to match backend configuration
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
if (!stripeKey) {
  console.error('Missing Stripe test mode publishable key')
}

const stripePromise = loadStripe(stripeKey || '')

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
}

export default function StripePayment() {
  const { cart } = useCart()
  const clientSecret = cart?.payment_collection?.
    payment_sessions?.[0].data.client_secret as string

  if (!clientSecret) {
    return (
      <div className="text-red-500 text-sm">
        Unable to initialize payment. Please try again or contact support.
      </div>
    )
  }

  return (
    <div className="w-full">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripeForm clientSecret={clientSecret} />
      </Elements>
    </div>
  )
}

const StripeForm = ({ 
  clientSecret,
}: {
  clientSecret: string | undefined
}) => {
  const router = useRouter()
  const { cart, refreshCart } = useCart()
  const { setCardHolderName, setCardComplete, setSelectedPaymentMethod, setIsReadyForOrder } = usePaymentContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState("")

  const stripe = useStripe()
  const elements = useElements()

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete)
    setIsReadyForOrder(event.complete && name.length > 2)
    setSelectedPaymentMethod("pp_stripe_stripe")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setCardHolderName(value)
    const card = elements?.getElement(CardElement)
    if (card) {
      card.on('change', (event) => {
        setIsReadyForOrder(value.length > 2 && event.complete)
      })
    }
  }

  async function handlePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!name) {
      setError("Please enter the cardholder name")
      return
    }

    const card = elements?.getElement(CardElement)
    if (!stripe || !elements || !card || !cart || !clientSecret) {
      setError("Payment initialization failed. Please refresh and try again.")
      return
    }

    setLoading(true)

    try {
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: name,
            email: cart.email,
            phone: cart.billing_address?.phone,
            address: {
              city: cart.billing_address?.city,
              country: cart.billing_address?.country_code,
              line1: cart.billing_address?.address_1,
              line2: cart.billing_address?.address_2,
              postal_code: cart.billing_address?.postal_code,
            },
          },
        },
      })

      if (paymentError) {
        throw new Error(paymentError.message || "Payment failed. Please try again.")
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/complete`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          },
          method: "POST",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to complete order. Please try again.")
      }

      const result = await response.json()

      if (result.type === "order" && result.order) {
        setSuccess(true)
        // Clean up cart data after successful order
        await refreshCart()
        router.push(`/order/confirmed/${result.order.id}`)
      } else {
        throw new Error(result.error?.message || "Failed to complete order")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-green-600 text-lg font-medium mb-2">
          Payment successful!
        </div>
        <p className="text-gray-600">
          Redirecting to order confirmation...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={name}
            onChange={handleNameChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Name on card"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details
          </label>
          <div className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm bg-white">
            <CardElement options={cardStyle} onChange={handleCardChange} />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <button 
        type="submit"
        disabled={loading || !stripe || !elements}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Complete Payment'
        )}
      </button>
    </form>
  )
}