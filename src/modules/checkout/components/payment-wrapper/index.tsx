"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { HttpTypes } from "@medusajs/types"

interface PaymentWrapperProps {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null)

const PaymentWrapper = ({ cart, children }: PaymentWrapperProps): React.ReactElement => {
  console.log("PaymentWrapper rendering with cart:", {
    cartId: cart.id,
    hasPaymentSession: !!cart.payment_collection?.payment_sessions?.length,
    paymentSessionId: cart.payment_collection?.payment_sessions?.[0]?.id || 'none'
  })

  // Get the cart's currency from the region
  const currency = cart.region?.currency_code?.toLowerCase() || 'aud'

  // Convert total to cents/smallest currency unit
  const amount = cart.total ? Math.round(cart.total * 100) : undefined

  // Pass the current payment session if it exists
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id.startsWith("pp_stripe_")
  ) || null

  if (process.env.NODE_ENV === 'development') {
    console.log("Payment session lookup:", {
      sessions: cart.payment_collection?.payment_sessions?.map(s => ({
        id: s.id,
        provider: s.provider_id
      })),
      found: !!paymentSession,
      selectedSession: paymentSession ? {
        id: paymentSession.id,
        provider: paymentSession.provider_id,
        hasClientSecret: !!paymentSession.data?.client_secret
      } : null
    })
  }

  return (
    <StripeWrapper
      paymentSession={paymentSession}
      stripeKey={stripeKey}
      stripePromise={stripePromise}
      currency={currency}
      amount={amount}
    >
      {children}
    </StripeWrapper>
  )
}

export default PaymentWrapper
