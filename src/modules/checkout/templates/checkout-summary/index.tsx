"use client"

import { useState } from "react"
import { Heading } from "@medusajs/ui"
import Link from "next/link"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-4 flex flex-col gap-y-8 py-4">
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <Heading
          level="h2"
          className="text-2xl font-semibold mb-8"
        >
          Order Summary
        </Heading>
        <div className="space-y-8">
          <ItemsPreviewTemplate cart={cart} />
          <Divider />
          <CartTotals
            totals={cart}
            selectedItems={cart.items?.reduce((acc: Record<string, boolean>, item: { id: string }) => ({
              ...acc,
              [item.id]: true
            }), {})}
          />
          <div className="pt-4">
            <DiscountCode cart={cart} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
