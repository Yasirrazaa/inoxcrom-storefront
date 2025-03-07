import { Metadata } from "next"
import { redirect } from "next/navigation"
import Overview from "@modules/account/components/overview"
import AccountLayout from "@modules/account/templates/account-layout"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function Account({
  params,
}: {
  params: { countryCode: string }
}) {
  try {
    const customer = await retrieveCustomer()

    if (!customer) {
      redirect(`/${params.countryCode}/login`)
    }

    const orders = await listOrders()

    return (
      <AccountLayout customer={customer}>
        <Overview customer={customer} orders={orders || []} />
      </AccountLayout>
    )
  } catch (error) {
    console.error('Account page error:', error)
    redirect(`/${params.countryCode}/login`)
  }
}
