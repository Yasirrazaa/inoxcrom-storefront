"use client"

import { Container } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { ArrowRight, Package, MapPin, UserCircle } from "lucide-react"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)

  return (
    <div className="w-full" data-testid="overview-page-wrapper">
      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Profile Completion */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <UserCircle className="w-8 h-8 text-[#0093D0]" />
            <div>
              <h3 className="text-lg font-bold">Profile</h3>
              <p className="text-sm text-gray-500">Completion status</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{profileCompletion}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#0093D0] h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Orders Count */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Package className="w-8 h-8 text-[#0093D0]" />
            <div>
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-sm text-gray-500">Purchase history</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900">
              {orders?.length || 0}
            </span>
            <LocalizedClientLink 
              href="/account/orders"
              className="mt-4 inline-flex items-center text-sm text-[#0093D0] hover:underline"
            >
              View all orders
              <ArrowRight className="w-4 h-4 ml-1" />
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Recent Orders</h3>
          <LocalizedClientLink 
            href="/account/orders"
            className="text-sm text-[#0093D0] hover:underline flex items-center"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </LocalizedClientLink>
        </div>

        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <LocalizedClientLink
                key={order.id}
                href={`/account/orders/details/${order.id}`}
                className="block hover:bg-gray-50 rounded-lg transition-colors duration-150"
                data-testid="order-wrapper"
              >
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Order number</p>
                      <p className="font-medium">#{order.display_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Date placed</p>
                      <p className="font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Total amount</p>
                      <p className="font-medium">
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-[#0093D0]">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">No orders yet</p>
              <p className="text-sm">Once you place an order, it will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return Math.round((count / 4) * 100)
}

export default Overview
