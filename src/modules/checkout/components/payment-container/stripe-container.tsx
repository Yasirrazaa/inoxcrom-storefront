"use client"

import { usePaymentContext } from "../payment/payment-context"
import StripePayment from "../payment-wrapper/stripe-payment"
import { Spinner } from "@medusajs/icons"
import { Suspense } from "react"

interface PaymentInfo {
  title: string;
  icon: React.ReactNode;
}

interface StripeCardContainerProps {
  paymentProviderId: string;
  selectedPaymentOptionId: string;
  paymentInfoMap: Record<string, PaymentInfo>;
}

const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
}: StripeCardContainerProps) => {
  const { cardHolderName, setCardHolderName } = usePaymentContext()
  const isSelected = paymentProviderId === selectedPaymentOptionId

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-x-3">
        {paymentInfoMap[paymentProviderId]?.icon}
        <span className="text-base-semi">Credit card</span>
      </div>
      {isSelected && (
        <div className="w-full mt-4">
          <div className="flex flex-col gap-y-2">
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cardholder name"
            />
            <div className="mt-2">
              <Suspense fallback={<Spinner />}>
                <StripePayment />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StripeCardContainer