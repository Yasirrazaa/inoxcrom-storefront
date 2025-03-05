import CartTemplate from "@modules/cart/templates"
import { retrieveCart } from "@lib/data/cart"
import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your shopping cart",
}

export default async function Cart({
  params,
}: {
  params: { countryCode: string }
}) {
  // Await the params before using them
  const resolvedParams = await params
  const countryCode = resolvedParams.countryCode.toLowerCase()
  
  try {
    const [cart, region, customer] = await Promise.all([
      retrieveCart(),
      getRegion(countryCode),
      retrieveCustomer()
    ])

    return (
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <CartTemplate 
          cart={cart} 
          region={region}
          countryCode={countryCode} 
          customer={customer}
        />
      </div>
    )
  } catch (error) {
    console.error("Error loading cart:", error)
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <CartTemplate 
          cart={null} 
          region={null}
          countryCode={countryCode}
          customer={null}
        />
      </div>
    )
  }
}
