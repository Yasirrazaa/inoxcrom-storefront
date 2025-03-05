"use client"

import { Button } from "@medusajs/ui"
import { Package, ShoppingBag, ArrowRight } from "lucide-react"
import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useOrderStatus } from "@lib/hooks/use-order-status"

const OrderOverview = ({ orders: initialOrders }: { orders: HttpTypes.StoreOrder[] }) => {
  const { orders } = useOrderStatus(initialOrders)
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Package className="w-8 h-8 text-[#0093D0]" />
            <div>
              <h3 className="text-lg font-bold">Orders</h3>
              <p className="text-sm text-gray-500">Purchase history</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {orders.length}
              </span>
              <span className="text-sm text-gray-500">
                {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
            <LocalizedClientLink
              href="/account/orders"
              className="text-sm text-[#0093D0] hover:underline flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </LocalizedClientLink>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="transition-all duration-200 hover:translate-y-[-2px]">
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-blue-50 rounded-full p-6 mb-6">
        <ShoppingBag className="w-10 h-10 text-[#0093D0]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
        No orders yet
      </h2>
      <p className="text-gray-500 max-w-md mb-8 text-center">
        You haven't placed any orders yet. Start shopping to fill this space with amazing products!
      </p>
      <LocalizedClientLink href="/">
        <Button 
          className="bg-[#0093D0] text-white hover:bg-blue-600 transition-colors px-8 py-3 rounded-lg"
          data-testid="continue-shopping-button"
        >
          Start Shopping
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
