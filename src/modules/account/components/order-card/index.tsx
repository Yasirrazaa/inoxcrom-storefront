import { Button } from "@medusajs/ui"
import { useMemo } from "react"
import { Package, ChevronRight } from "lucide-react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const getOrderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-600'
      case 'pending':
        return 'bg-yellow-50 text-yellow-600'
      case 'processing':
        return 'bg-blue-50 text-blue-600'
      case 'cancelled':
        return 'bg-red-50 text-red-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Package className="w-8 h-8 text-[#0093D0]" />
          <div>
            <h3 className="text-lg font-bold">Order #{order.display_id}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()} • {numberOfLines} {numberOfLines > 1 ? "items" : "item"}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatus(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 mt-6">
        <p className="text-sm font-medium text-gray-500 mb-4">Items in Order</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {order.items?.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2"
              data-testid="order-item"
            >
              <div className="aspect-square relative rounded-md overflow-hidden bg-gray-50">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={[]}
                  size="full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </span>
                <span className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          ))}
          {numberOfProducts > 3 && (
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-100">
              <span className="text-sm font-medium text-[#0093D0]">
                +{numberOfProducts - 3} more items
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            View complete order details including shipping information
          </span>
          <LocalizedClientLink
            href={`/account/orders/details/${order.id}`}
            className="inline-flex items-center px-6 py-2 bg-[#0093D0] text-white rounded-lg hover:bg-[#007bb3] transition-colors duration-200 text-sm font-medium"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-2" />
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
