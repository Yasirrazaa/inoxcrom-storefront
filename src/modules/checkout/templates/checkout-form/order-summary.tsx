"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { placeOrder, applyPromotions, initiatePaymentSession } from "@lib/data/cart"
import { useRouter } from "next/navigation"
import CartTotals from "@modules/common/components/cart-totals"
import { usePaymentContext } from "@modules/checkout/components/payment/payment-context"

type PaymentSessionStatus = "authorized" | "pending" | "requires_more" | "error" | "canceled"

interface PaymentSession {
  status: PaymentSessionStatus
  provider_id: string
}

interface CompleteOrder {
  id: string
  status: string
  payment_status: string
  payment_sessions?: PaymentSession[]
}

interface OrderSummaryProps {
  cart: HttpTypes.StoreCart
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
  const [promoCode, setPromoCode] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const router = useRouter()
  const { selectedPaymentMethod, cardComplete } = usePaymentContext()

  const handlePlaceOrder = async () => {
    if (!cart.shipping_methods?.[0]) {
      alert("Please select a shipping method")
      return
    }

    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }

    setIsPlacingOrder(true)
    try {
      // 1. Place the order - this will trigger payment authorization internally
      const result = await placeOrder(cart.id)
      
      if (!result) {
        throw new Error("Failed to create order")
      }

      // Safe type casting through unknown
      const order = (result as unknown) as CompleteOrder
      
      if (!order.id) {
        throw new Error("Failed to create order")
      }

      // 2. Check payment status
      const paymentSession = order.payment_sessions?.find(
        (ps) => ps.provider_id === selectedPaymentMethod
      )

      // 3. Verify payment status
      if (!paymentSession || paymentSession.status === "error") {
        throw new Error("Payment failed. Please try again.")
      }

      if (paymentSession.status !== "authorized") {
        throw new Error("Payment requires verification. Please try again.")
      }

      // 3. Success - redirect to confirmation
      router.push(`/order/confirmed/${order.id}`)
      
    } catch (error: any) {
      console.error("Error placing order:", error)
      alert(error.message || "Failed to place order. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode) return
    setIsApplyingPromo(true)
    try {
      await applyPromotions([promoCode])
      router.refresh()
      setPromoCode("")
    } catch (error) {
      console.error("Error applying promotion:", error)
      alert("Failed to apply promotion. Please try again.")
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const isStripe = (paymentMethod: string) => paymentMethod === "stripe";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-medium mb-6">Order Summary</h2>
      <div className="space-y-4">
        {/* Items Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Items in Cart</h3>
          <div className="space-y-3">
            {cart.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {item.quantity}x {item.title || item.variant?.title}
                </span>
                <span className="font-medium">
                  {cart.currency_code?.toUpperCase()} {((item.unit_price * item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion Code */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
              Have a Promotion Code?
            </label>
            {cart.discount_total > 0 && (
              <div className="flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Discount applied
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-2 border rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter your promo code"
            />
            <Button
              variant="secondary"
              onClick={handleApplyPromo}
              isLoading={isApplyingPromo}
              className="whitespace-nowrap px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Order Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                {cart.currency_code?.toUpperCase()} {((cart.subtotal || 0)).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className={cart.shipping_total > 0 ? "font-medium" : "text-gray-500"}>
                {cart.shipping_total > 0
                  ? `${cart.currency_code?.toUpperCase()} ${(cart.shipping_total).toFixed(2)}`
                  : "Calculated at next step"
                }
              </span>
            </div>

            {cart.discount_total > 0 && (
              <div className="flex justify-between text-sm">
                <span className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Discount
                </span>
                <span className="text-green-600">
                  -{cart.currency_code?.toUpperCase()} {(cart.discount_total).toFixed(2)}
                </span>
              </div>
            )}

            {cart.tax_total > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  {cart.currency_code?.toUpperCase()} {(cart.tax_total).toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">
                  {cart.currency_code?.toUpperCase()} {(cart.total || 0).toFixed(2)}
                </span>
              </div>
              {cart.shipping_total > 0 && (
                <p className="text-xs text-gray-500 text-right mt-1">
                  Including shipping and tax
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Place Order Section */}
        <div className="mt-6">
          <Button
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            onClick={handlePlaceOrder}
            isLoading={isPlacingOrder}
            disabled={!cart.shipping_methods?.[0] || !selectedPaymentMethod || (isStripe(selectedPaymentMethod) && !cardComplete)}
          >
            {isPlacingOrder ? (
              "Processing..."
            ) : (
              `Pay ${cart.currency_code?.toUpperCase()} ${((cart.total || 0)).toFixed(2)}`
            )}
          </Button>

          {/* Validation Messages */}
          {(!cart.shipping_methods?.[0] || !selectedPaymentMethod || (isStripe(selectedPaymentMethod) && !cardComplete)) && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div className="flex text-sm text-yellow-800">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <ul className="list-disc ml-5 space-y-1">
                  {!cart.shipping_methods?.[0] && (
                    <li>Please select a shipping method</li>
                  )}
                  {!selectedPaymentMethod && (
                    <li>Please select a payment method</li>
                  )}
                  {isStripe(selectedPaymentMethod) && !cardComplete && (
                    <li>Please complete the card details</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
