"use client"

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripeElements } from "@stripe/stripe-js"
import { useContext, useEffect, useState } from "react"
import { usePaymentContext } from "../payment/payment-context"
import { StripeContext } from "./stripe-wrapper"
import { Spinner } from "@medusajs/icons"

const StripePayment = () => {
  const stripe = useStripe()
  const elements = useElements()
  const isStripeReady = useContext(StripeContext)
  const { setCardComplete, setCardBrand, setError } = usePaymentContext()
  const [isElementMounted, setIsElementMounted] = useState(false)

  useEffect(() => {
    const initializePaymentElement = async () => {
      if (!stripe || !elements || !isStripeReady) {
        console.log("Stripe not yet initialized")
        return
      }

      try {
        const paymentElement = elements.getElement("payment")
        if (!paymentElement) {
          console.log("Creating new payment element")
          setIsElementMounted(false)
          return
        }

        console.log("Payment element found, setting up listeners")
        setIsElementMounted(true)

        const handleChange = (event: any) => {
          console.log("Payment element change:", {
            complete: event.complete,
            value: event.value
          })
          
          setCardComplete(event.complete)
          setCardBrand('card')
          
          if (event.value?.type === 'validation_error') {
            setError(event.value.message || 'Invalid card details')
          } else {
            setError(null)
          }
        }

        paymentElement.on('change', handleChange)
        return () => {
          paymentElement.off('change')
        }
      } catch (error) {
        console.error("Error initializing payment element:", error)
        setError("Failed to initialize payment form")
      }
    }

    initializePaymentElement()
  }, [stripe, elements, isStripeReady, setCardComplete, setCardBrand, setError])

  if (!stripe || !elements || !isStripeReady) {
    return (
      <div className="min-h-[130px] flex items-center justify-center bg-white rounded-lg p-4">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-[130px] bg-white rounded-lg">
      {!isElementMounted ? (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      ) : (
        <PaymentElement
          className="w-full"
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true
            },
            fields: {
              billingDetails: { 
                name: 'never',
                email: 'never',
                phone: 'never',
                address: 'never'
              }
            },
            wallets: {
              applePay: 'never',
              googlePay: 'never'
            }
          }}
        />
      )}
    </div>
  )
}

export default StripePayment