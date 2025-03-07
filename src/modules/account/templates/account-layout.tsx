import React from "react"
import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 py-6 md:py-12 bg-gray-50" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:gap-8">
          {/* Welcome Banner */}
          <div className="w-full bg-[#0093D0] text-white rounded-lg p-6 md:p-8 shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back{customer?.first_name ? `, ${customer.first_name}` : ""}!
            </h1>
            <p className="text-white/80">
              Manage your account settings and view your orders
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Navigation */}
            <div className="md:bg-white md:p-6 md:rounded-lg md:shadow-sm">
              {customer && <AccountNav customer={customer} />}
            </div>

            {/* Content Area */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {children}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600">
                  Feel free to reach out to our support team for assistance.
                  Need help? contact customer service.
                </p>
              </div>
              <div className="flex items-center">
                <UnderlineLink href="/contact">
                  <button className="inline-flex items-center px-6 py-3 bg-[#0093D0] text-white rounded-lg hover:bg-[#007bb3] transition-colors duration-200 font-medium">
                    Visit Customer Service
                  </button>
                </UnderlineLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
