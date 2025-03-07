"use client"

import { HttpTypes } from "@medusajs/types"
import { usePaymentContext } from "@modules/checkout/components/payment/payment-context"
import { useState } from "react"
import { useCart } from "../../../../providers/cart-provider"
import StripePayment from "./stripe"
import { CreditCard } from "@medusajs/icons"

interface PaymentMethodSelectorProps {
  paymentMethods: {
    id: string
  }[]
  cart: HttpTypes.StoreCart
}

export default function PaymentMethodSelector({ paymentMethods, cart }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { setSelectedPaymentMethod } = usePaymentContext()
  const { setCart } = useCart()

  const handleSelectProvider = async (methodId: string) => {
    setLoading(true)
    try {
      setSelectedMethod(methodId)
      setSelectedPaymentMethod(methodId)

      let paymentCollectionId = cart.payment_collection?.id

      if (!paymentCollectionId) {
        // Create payment collection
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-collections`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
            },
            body: JSON.stringify({
              cart_id: cart.id,
            }),
          }
        )
        const { payment_collection } = await response.json()
        paymentCollectionId = payment_collection.id
      }

      // Initialize payment session
      await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          },
          body: JSON.stringify({
            provider_id: methodId,
          }),
        }
      )

      // Re-fetch cart to get updated payment session
      const { cart: updatedCart } = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          },
        }
      ).then(res => res.json())

      setCart(updatedCart)
    } catch (error) {
      console.error("Failed to initialize payment:", error)
      setSelectedMethod("")
      setSelectedPaymentMethod("")
    } finally {
      setLoading(false)
    }
  }

  const getPaymentMethodDetails = (methodId: string) => {
    const isStripe = methodId.includes("stripe")
    return {
      displayName: isStripe ? "Credit Card" : methodId.replace('pp_', '').replace('_', ' ').toLowerCase(),
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const { displayName } = getPaymentMethodDetails(method.id)
          const isSelected = selectedMethod === method.id
          
          return (
            <label 
              key={method.id}
              className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
                loading ? "opacity-50 pointer-events-none" : ""
              } ${isSelected ? "border-blue-500 bg-blue-50" : ""}`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={isSelected}
                onChange={() => handleSelectProvider(method.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-3 flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                {displayName}
              </span>
              {loading && isSelected && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </label>
          )
        })}
      </div>

      {/* Stripe Payment Form */}
      {selectedMethod && selectedMethod.includes("stripe") && (
        <div className="mt-4 border rounded-lg p-4 bg-white">
          <StripePayment />
        </div>
      )}
    </div>
  )
}
