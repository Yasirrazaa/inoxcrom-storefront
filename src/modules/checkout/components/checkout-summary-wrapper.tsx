"use client"

import { useRouter } from "next/navigation"
import CheckoutSummary from "../templates/checkout-summary"
import { usePaymentContext } from "./payment/payment-context"
import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { initiatePaymentSession, retrieveCart } from "@lib/data/cart"

interface CheckoutSummaryWrapperProps {
  cart: HttpTypes.StoreCart
  countryCode: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const SUBMIT_TIMEOUT = 5000 // 5 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface PaymentData {
  provider_id: string
  data: {
    email?: string
    metadata?: Record<string, any>
  }
}

interface CartData {
  id: string
  total: number
  region?: {
    currency_code?: string
  }
}

export default function CheckoutSummaryWrapper({ cart, countryCode }: CheckoutSummaryWrapperProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { 
    cardComplete, 
    cardHolderName,
    selectedPaymentMethod,
    isReadyForOrder
  } = usePaymentContext()

  const logCheckout = (label: string, data: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Checkout] ${label}:`, {
        ...data,
        timestamp: new Date().toISOString()
      })
    }
  }

  const validatePayment = () => {
    if (!selectedPaymentMethod) {
      throw new Error("Please select a payment method")
    }

    if (selectedPaymentMethod === "pp_stripe_stripe") {
      if (!cardComplete) {
        throw new Error("Please complete your card details")
      }

      if (!cardHolderName || cardHolderName.trim().length < 2) {
        throw new Error("Please enter a valid cardholder name")
      }

      if (!isReadyForOrder) {
        throw new Error("Please complete all payment details")
      }
    }
  }

  const initializePaymentSession = async (retryCount = 0): Promise<boolean> => {
    try {
      logCheckout('Initializing payment session', {
        cartId: cart.id,
        attempt: retryCount + 1
      })

      const cartData: CartData = {
        id: cart.id,
        total: cart.total || 0,
        region: {
          currency_code: cart.region?.currency_code || "aud"
        }
      }

      const stripeProviderId = "pp_stripe_stripe"

      const paymentData: PaymentData = {
        provider_id: stripeProviderId,
        data: {
          email: cart.email || ""
        }
      }

      await initiatePaymentSession(cartData, paymentData)
      
      // Wait for session to be fully initialized
      await delay(500)
      
      // Get updated cart with new session
      const updatedCart = await retrieveCart(cart.id)
      
      if (!updatedCart) {
        throw new Error("Could not retrieve updated cart")
      }
      
      const session = updatedCart.payment_collection?.payment_sessions?.find(
        s => s.provider_id.startsWith("pp_stripe_")
      )

      if (!session?.data?.client_secret) {
        throw new Error("Payment initialization failed")
      }

      logCheckout('Payment session initialized', {
        sessionId: session.id,
        hasClientSecret: true
      })

      return true
    } catch (error) {
      logCheckout('Payment initialization failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        attempt: retryCount + 1 
      })

      if (retryCount < MAX_RETRIES) {
        await delay(RETRY_DELAY)
        return initializePaymentSession(retryCount + 1)
      }
      throw error
    }
  }

  const handlePlaceOrder = async () => {
    setError(null)
    setIsProcessing(true)
    
    try {
      // Validate payment details
      validatePayment()

      logCheckout('Starting payment process', {
        cartId: cart.id,
        method: selectedPaymentMethod
      })

      // Initialize payment session if using Stripe
      if (selectedPaymentMethod === "pp_stripe_stripe") {
        const initialized = await initializePaymentSession()
        if (!initialized) {
          throw new Error("Could not initialize payment")
        }

        // Submit form with retries and timeout
        logCheckout('Submitting payment form', cart)
        
        const findSubmitButton = (): HTMLButtonElement | null => {
          const button = document.querySelector('[role="presentation"].StripeElement button[type="submit"]')
          return button instanceof HTMLButtonElement ? button : null
        }

        let attempts = 0
        let submitted = false
        
        while (attempts < 10 && !submitted) {
          const submitButton = findSubmitButton()
          if (submitButton) {
            submitButton.click()
            submitted = true
            break
          }
          await delay(500)
          attempts++
        }

        if (!submitted) {
          setIsProcessing(false)
          throw new Error("Payment form not ready. Please refresh and try again.")
        }
      }
      
    } catch (error: any) {
      logCheckout('Order placement error', {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
      setError(error.message || "An error occurred during checkout")
      setIsProcessing(false)
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-blue-600 text-sm">Processing payment...</p>
        </div>
      )}

      <div className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
        <CheckoutSummary 
          cart={cart} 
          onPlaceOrder={handlePlaceOrder}
        />
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg text-xs font-mono">
          <div className="font-bold mb-2">Checkout Debug Info:</div>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              isProcessing,
              hasError: !!error,
              selectedMethod: selectedPaymentMethod,
              cardComplete,
              hasName: !!cardHolderName,
              nameLength: cardHolderName?.length,
              isReady: isReadyForOrder,
              cartTotal: cart.total,
              hasPaymentSessions: cart.payment_collection?.payment_sessions?.length
            }, null, 2)}
          </pre>
        </div>
      )}
    </>
  )
}
