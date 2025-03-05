"use client"

import { Text, clx } from "@medusajs/ui"
import React from "react"
import { isManual } from "@lib/constants"
import type { ReactElement } from "react"

export interface PaymentContainerProps {
  paymentProviderId: string
  paymentInfoMap: Record<string, { 
    title: string
    icon: ReactElement 
  }>
  children?: React.ReactNode
  disabled?: boolean
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <div 
      className={clx(
        "rounded-lg border border-gray-200 bg-white p-6 transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md",
      )}
      role="region"
      aria-label="Payment method selection"
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            {/* Payment method icon/logo */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
              {paymentInfoMap[paymentProviderId]?.icon}
            </div>

            {/* Payment method title */}
            <Text className="text-base-regular">
              {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
            </Text>

            {/* Development test badge */}
            {isManual(paymentProviderId) && isDevelopment && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Test Mode
              </span>
            )}
          </div>
        </div>

        {/* Payment form */}
        <div
          className={clx(
            "transition-all duration-200 space-y-4",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          {children}
        </div>
      </div>

      {/* Development debug info */}
      {isDevelopment && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="text-xs font-mono text-gray-500">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                provider: paymentProviderId,
                disabled,
                hasIcon: !!paymentInfoMap[paymentProviderId]?.icon,
                hasTitle: !!paymentInfoMap[paymentProviderId]?.title
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentContainer
