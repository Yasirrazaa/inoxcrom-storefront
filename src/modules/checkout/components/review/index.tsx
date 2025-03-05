"use client"

import { Heading, Text } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"
  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const previousStepsCompleted = cart.shipping_address && cart.shipping_methods.length > 0 && (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-8">
      <div className="flex flex-col gap-6">
        {previousStepsCompleted && (
          <>
            <div className="space-y-6">
              <ItemsPreviewTemplate cart={cart} />
              <Divider />
              <CartTotals totals={cart} />
            </div>

            <div className="flex flex-col gap-4">
              <Heading level="h2" className="text-xl font-medium">
                Place Your Order
              </Heading>
              
              <Text className="text-gray-600 text-sm">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>

            <div className="bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
              <PaymentButton cart={cart} data-testid="submit-order-button" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Review
