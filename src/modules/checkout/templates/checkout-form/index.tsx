import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import { Payment } from "@modules/checkout/components/payment"
import Shipping from "@modules/checkout/components/shipping"
import OrderSummary from "./order-summary"
import { PaymentProvider } from "@modules/checkout/components/payment/payment-context";

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Checkout Steps */}
          <div className="space-y-8">
            {/* Step 1: Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">1. Shipping Address</h2>
                <p className="mt-1 text-sm text-gray-500">Select where you want your items delivered</p>
              </div>
              <Addresses cart={cart} customer={customer} />
            </div>

            {/* Step 2: Delivery Method */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">2. Delivery Method</h2>
                <p className="mt-1 text-sm text-gray-500">Choose how you want your order shipped</p>
              </div>
              <Shipping cart={cart} availableShippingMethods={shippingMethods} />
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">3. Payment Information</h2>
                <p className="mt-1 text-sm text-gray-500">Complete your order by providing payment details</p>
              </div>
              <PaymentProvider>
                <Payment cart={cart} availablePaymentMethods={paymentMethods} />
              </PaymentProvider>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}
