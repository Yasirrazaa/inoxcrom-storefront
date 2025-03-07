import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import { listRegions } from "@lib/data/regions"
import ProfileContent from "@modules/account/components/profile-content"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <AccountLayout customer={customer}>
      <ProfileContent customer={customer} regions={regions} />
    </AccountLayout>
  )
}
