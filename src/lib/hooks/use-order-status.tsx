"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { retrieveOrder } from "@lib/data/orders"
import { HttpTypes } from "@medusajs/types"

const POLL_INTERVAL = 60000 // Poll every 60 seconds

export const useOrderStatus = (orders: HttpTypes.StoreOrder[]) => {
  const [currentOrders, setCurrentOrders] = useState(orders)
  const previousStatuses = useRef<Record<string, string>>({})

  useEffect(() => {
    // Initialize previous statuses
    const statusMap: Record<string, string> = {}
    orders.forEach((order) => {
      statusMap[order.id] = order.status
    })
    previousStatuses.current = statusMap
  }, [])

  useEffect(() => {
    const pollOrderStatus = async () => {
      try {
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const updatedOrder = await retrieveOrder(order.id)
            if (updatedOrder) {
              // Check if status has changed
              const previousStatus = previousStatuses.current[order.id]
              if (previousStatus && previousStatus !== updatedOrder.status) {
                toast.success(
                  `Order #${updatedOrder.display_id} status updated to ${updatedOrder.status}`,
                  {
                    duration: 5000,
                    position: "top-center",
                  }
                )
              }
              // Update previous status
              previousStatuses.current[order.id] = updatedOrder.status
              return updatedOrder
            }
            return order
          })
        )
        setCurrentOrders(updatedOrders)
      } catch (error) {
        console.error("Error polling order status:", error)
      }
    }

    const intervalId = setInterval(pollOrderStatus, POLL_INTERVAL)

    return () => clearInterval(intervalId)
  }, [orders])

  return { orders: currentOrders }
}