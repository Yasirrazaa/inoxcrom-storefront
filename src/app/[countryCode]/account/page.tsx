import { Metadata } from "next"
import { notFound } from "next/navigation"
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
  const customer = await retrieveCustomer()
  const orders = await listOrders()

  if (!customer) {
    notFound()
  }

  return (
    <AccountLayout customer={customer}>
      <Overview customer={customer} orders={orders} />
    </AccountLayout>
  )
}