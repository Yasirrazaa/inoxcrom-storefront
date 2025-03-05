"use client"

import { Button } from "@medusajs/ui"
import { usePaymentContext } from "../payment/payment-context"
import { useState } from "react"

interface PaymentButtonProps {
  onSubmit: () => Promise<void>
}

const PaymentButton = ({ onSubmit }: PaymentButtonProps) => {
  const { 
    selectedPaymentMethod,
    cardComplete,
    cardHolderName,
    isReadyForOrder,
    error
  } = usePaymentContext()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [buttonError, setButtonError] = useState<string | null>(null)

  const getValidationMessage = () => {
    if (!selectedPaymentMethod) {
      return "Please select a payment method"
    }

    if (selectedPaymentMethod === "stripe") {
      if (!cardHolderName?.trim()) {
        return "Please enter cardholder name"
      }
      if (!cardComplete) {
        return "Please complete card details"
      }
      if (!isReadyForOrder) {
        return "Please complete all payment details"
      }
    }

    return null
  }

  const handleClick = async () => {
    const validationMessage = getValidationMessage()
    if (validationMessage) {
      setButtonError(validationMessage)
      return
    }

    setButtonError(null)
    setIsSubmitting(true)

    try {
      await onSubmit()
    } catch (err) {
      // Error is handled by the parent component
      console.error("Payment submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = !isReadyForOrder || isSubmitting || !!error

  return (
    <div className="space-y-2">
      <Button 
        className="w-full" 
        size="large"
        disabled={isDisabled}
        isLoading={isSubmitting}
        onClick={handleClick}
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </Button>

      {buttonError && !error && (
        <div className="text-rose-500 text-small-regular">
          {buttonError}
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs font-mono">
          <div className="font-bold mb-2">Button Debug Info:</div>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              isDisabled,
              isSubmitting,
              hasError: !!error,
              buttonError,
              cardComplete,
              hasName: !!cardHolderName,
              isReadyForOrder,
              selectedPaymentMethod
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default PaymentButton
