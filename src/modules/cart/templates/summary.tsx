"use client"

import { Button } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"

type SummaryProps = {
  cart: HttpTypes.StoreCart
  customer?: HttpTypes.StoreCustomer | null
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, customer }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <DiscountCode cart={cart as HttpTypes.StoreCart & { promotions: HttpTypes.StorePromotion[] }} />
      <div className="mt-4">
        <CartTotals totals={cart} />
      </div>
      {customer ? (
        <LocalizedClientLink
          href={`/checkout?step=${step}`}
          data-testid="checkout-button"
        >
          <Button 
            className="w-full h-12 bg-[#0093D0] hover:bg-blue-700 text-white font-bold rounded transition-colors"
          >
            Proceed to Checkout
          </Button>
        </LocalizedClientLink>
      ) : (
        <LocalizedClientLink
          href="/account/login"
          data-testid="sign-in-button"
        >
          <Button 
            className="w-full h-12 bg-[#0093D0] hover:bg-blue-700 text-white font-bold rounded transition-colors"
          >
            Sign in to Checkout
          </Button>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary
