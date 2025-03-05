"use client"

import { Elements } from "@stripe/react-stripe-js"
import { 
  Stripe, 
  StripeElementsOptions,
  StripeElementsOptionsClientSecret,
  Appearance 
} from "@stripe/stripe-js"
import React, { createContext } from "react"
import { HttpTypes } from "@medusajs/types"

export const StripeContext = createContext(false)

interface PaymentSessionData {
  client_secret?: string
  [key: string]: any
}

interface PaymentSession extends HttpTypes.StorePaymentSession {
  data: PaymentSessionData
}

interface WrapperProps {
  paymentSession: PaymentSession | null
  stripeKey: string
  children: React.ReactNode
  stripePromise: Promise<Stripe | null>
  currency?: string
  amount?: number
}

const appearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '4px',
  },
}

const StripeWrapper = ({
  paymentSession,
  children,
  stripePromise,
  stripeKey,
  amount,
  currency = 'aud'
}: WrapperProps) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  // Log state in development
  if (isDevelopment) {
    console.log("StripeWrapper state:", {
      hasStripeKey: !!stripeKey,
      hasStripePromise: !!stripePromise,
      sessionId: paymentSession?.id || 'none',
      hasClientSecret: !!paymentSession?.data?.client_secret,
      currency,
      amount
    })
  }

  if (!stripePromise) {
    console.warn("Stripe initialization blocked: No Stripe promise available")
    return <div>{children}</div>
  }

  let options: StripeElementsOptions

  if (paymentSession?.data?.client_secret) {
    // When we have a client secret, create payment-specific options
    const paymentOptions: StripeElementsOptionsClientSecret = {
      appearance,
      clientSecret: paymentSession.data.client_secret,
    }

    options = paymentOptions
  } else {
    // When just collecting card details, use base options
    options = {
      appearance,
    }
  }

  if (isDevelopment) {
    console.log("Stripe Elements options:", {
      hasClientSecret: 'clientSecret' in options,
      appearance: !!options.appearance
    })
  }

  return (
    <StripeContext.Provider value={true}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
