import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { PaymentProvider } from "@modules/checkout/components/payment/payment-context"
import PaymentMethodSelector from "./payment-method-selector"
import StripePayment from "./stripe"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Checkout",
}

interface Props {
  params: {
    countryCode: string
  }
}

export default async function Checkout({
  params,
}: Props) {
  // Ensure params is handled properly
  const countryCode = params?.countryCode
  if (!countryCode) {
    return notFound()
  }

  // Load all required data
  const [cart, customer] = await Promise.all([
    retrieveCart(),
    retrieveCustomer({})
  ])

  // Check cart exists
  if (!cart) {
    return notFound()
  }

  // Check customer exists and redirect if not
  if (!customer) {
    redirect(`/${countryCode}/account`)
  }

  // Ensure we have valid cart data
  if (!cart.email) {
    // Redirect to cart with a friendly message if email is missing
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Email Address Required</h2>
      <p className="text-gray-600 mb-6">Please add your email address in your account before proceeding to checkout.</p>
      <Link 
        href={`/${countryCode}/cart`} 
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Return to Cart
      </Link>
      </div>
    );
  }

  // Validate shipping address is present before allowing payment
 

  const shippingMethods = await listCartShippingMethods(cart.id);

  if (!shippingMethods) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Unable to load checkout options. Please try again.</p>
      </div>
    );
  }

  const hasShippingAddress = cart.shipping_address?.address_1
  const hasShippingMethod = cart.shipping_methods && cart.shipping_methods.length > 0
  
  // Get available payment methods
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!paymentMethods) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Unable to load payment methods. Please try again.</p>
      </div>
    )
  }

  return (
    <PaymentProvider>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-gray-500 text-sm">
            <Link href={`/${countryCode}`} className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">{'/'}</span>
            <Link href={`/${countryCode}/cart`} className="hover:text-gray-700">
              Cart
            </Link>
            <span className="mx-2">{'/'}</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column - Checkout Process */}
            <div className="space-y-8">
              {/* Step 1: Shipping Address */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">1. Shipping Address</h2>
                  <p className="mt-1 text-sm text-gray-500">Select where you want your items delivered</p>
                </div>
                <Addresses cart={cart} customer={customer} countryCode={countryCode} />
              </div>

              {/* Step 2: Delivery Method */}
              {hasShippingAddress && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">2. Delivery Method</h2>
                    <p className="mt-1 text-sm text-gray-500">Choose how you want your order shipped</p>
                  </div>
                  <Shipping cart={cart} availableShippingMethods={shippingMethods} />
                </div>
              )}

              {/* Step 3: Payment */}
              {hasShippingAddress && hasShippingMethod && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">3. Payment Information</h2>
                    <p className="mt-1 text-sm text-gray-500">Select your preferred payment method</p>
                  </div>
                  <div className="space-y-6">
                    <PaymentMethodSelector paymentMethods={paymentMethods} cart={cart} />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-lg shadow-lg">
                  <CheckoutSummary
                    cart={cart}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PaymentProvider>
  )
}
