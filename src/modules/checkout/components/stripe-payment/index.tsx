"use client"

import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { usePaymentContext } from "../payment/payment-context"
import React, { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")

interface StripePaymentProps {
  cart: HttpTypes.StoreCart
}

const StripePayment = ({ cart }: StripePaymentProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  
  const {
    setCardComplete,
    setCardBrand,
    setError,
    cardHolderName,
    setCardHolderName,
    setSelectedPaymentMethod,
    setStripeFormComplete
  } = usePaymentContext()

  useEffect(() => {
    // Set Stripe as payment method when component mounts
    setSelectedPaymentMethod("stripe")

    // Cleanup when unmounting
    return () => {
      setSelectedPaymentMethod("")
      setCardComplete(false)
      setCardBrand(null)
      setError(null)
    }
  }, [])

  const handleChange = (event: any) => {
    setCardComplete(event.complete)
    setStripeFormComplete(event.complete)
    
    if (event.brand) {
      setCardBrand(event.brand)
    }
    
    if (event.error) {
      setError(event.error.message)
    } else {
      setError(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Cardholder Name Input */}
      <div className="bg-white p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          id="cardHolderName"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-black focus:border-black"
          placeholder="Name on card"
          required
        />
      </div>

      {/* Card Details Input */}
      <div className="bg-white p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement
          id="card-element"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#dc2626',
                iconColor: '#dc2626'
              }
            }
          }}
          onChange={handleChange}
          className="p-3 border rounded-md"
        />
      </div>

      {processing && (
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default StripePayment
