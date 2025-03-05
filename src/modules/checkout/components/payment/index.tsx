"use client"

import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import StripePayment from "@modules/checkout/components/stripe-payment"
import PaymentContainer from "@modules/checkout/components/payment-container"
import Spinner from "@modules/common/icons/spinner"
import { usePaymentContext } from "./payment-context"
import PaymentWrapper from "../payment-wrapper"
import Image from "next/image"
import type { ReactElement } from "react"

interface PaymentProps {
  cart: HttpTypes.StoreCart
}

// Payment provider information map
const PAYMENT_INFO_MAP: Record<string, { title: string; icon: ReactElement }> = {
  "pp_stripe_stripe": {
    title: "Credit Card (Stripe)",
    icon: (
      <Image
        key="stripe-icon"
        src="/stripe-badge-white.png"
        alt="Stripe"
        width={50}
        height={25}
        className="object-contain"
      />
    ),
  },
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40">
    <Spinner />
  </div>
)

const DebugInfo = ({ cart, error, selectedPaymentMethod }: {
  cart: HttpTypes.StoreCart
  error: string | null
  selectedPaymentMethod: string
}) => (
  <div className="bg-gray-50 p-4 rounded-lg text-xs font-mono mt-4">
    <div className="font-bold mb-2">Payment Debug Info:</div>
    <pre className="whitespace-pre-wrap">
      {JSON.stringify({
        selectedMethod: selectedPaymentMethod,
        hasError: !!error,
        cartId: cart.id,
        hasPaymentSessions: cart.payment_collection?.payment_sessions?.length ?? 0 > 0,
        cartTotal: cart.total,
        sessionCount: cart.payment_collection?.payment_sessions?.length ?? 0
      }, null, 2)}
    </pre>
  </div>
)

const Payment = ({ cart }: PaymentProps) => {
  const { 
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    error
  } = usePaymentContext()

  // Always default to Stripe for now
  if (!selectedPaymentMethod) {
    setSelectedPaymentMethod("pp_stripe_stripe")
  }

  return (
    <div className="space-y-6">
      <PaymentContainer
        paymentProviderId="pp_stripe_stripe"
        paymentInfoMap={PAYMENT_INFO_MAP}
        disabled={false}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <PaymentWrapper cart={cart}>
            <StripePayment cart={cart} />
          </PaymentWrapper>
        </Suspense>
      </PaymentContainer>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <DebugInfo 
          cart={cart}
          error={error}
          selectedPaymentMethod={selectedPaymentMethod}
        />
      )}
    </div>
  )
}

export default Payment
