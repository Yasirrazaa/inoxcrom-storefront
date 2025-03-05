"use client"

import { useState, useEffect } from "react"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { deleteLineItem, retrieveCart, updateLineItem } from "@lib/data/cart"
import { useRouter } from "next/navigation"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

type LoadingState = Record<string, boolean>
type QuantityState = Record<string, number>
type SelectedState = Record<string, boolean>

export default function ItemsTemplate({ cart: initialCart }: ItemsTemplateProps) {
  const router = useRouter()
  const [cart, setCart] = useState<HttpTypes.StoreCart | null | undefined>(initialCart)
  const [selectedItems, setSelectedItems] = useState<SelectedState>({})
  const [quantities, setQuantities] = useState<QuantityState>({})
  const [loading, setLoading] = useState<LoadingState>({})

  const items = cart?.items

  const cleanupLocalState = (itemId: string) => {
    setSelectedItems(prev => {
      const newSelected = { ...prev }
      delete newSelected[itemId]
      return newSelected
    })
    setQuantities(prev => {
      const newQuantities = { ...prev }
      delete newQuantities[itemId]
      return newQuantities
    })
  }

  // Initialize quantities from cart
  useEffect(() => {
    if (initialCart?.items) {
      const initialQuantities = initialCart.items.reduce<QuantityState>((acc, item) => ({
        ...acc,
        [item.id]: item.quantity
      }), {})
      setQuantities(initialQuantities)
      setCart(initialCart)
    }
  }, [initialCart])

  // Calculate total price using local quantities
  const totalPrice = items?.reduce((sum, item) => {
    if (selectedItems[item.id]) {
      const quantity = quantities[item.id] || item.quantity
      return sum + ((item.unit_price || 0) * quantity) 
    }
    return sum
  }, 0) || 0

  const handleCheckItem = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const handleCheckout = async () => {
    const selectedIds = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id)
    
    if (selectedIds.length === 0) {
      alert('Please select items to checkout')
      return
    }

    try {
      // Update quantities in the backend before proceeding to checkout
      const itemPromises = cart?.items
        ?.filter(item => selectedItems[item.id])
        .map(item => updateLineItem({
          lineId: item.id,
          quantity: quantities[item.id] || item.quantity
        })) || []

      await Promise.all(itemPromises)

      if (cart?.region?.countries?.[0]?.iso_2) {
        router.push(`/${cart.region.countries[0].iso_2.toLowerCase()}/checkout`)
      }
    } catch (error) {
      console.error('Error updating quantities before checkout:', error)
      alert('There was an error processing your cart. Please try again.')
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return

    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        setLoading(prev => ({ ...prev, [itemId]: true }))
        
        // Get current cart state
        const currentCart = await retrieveCart()
        const item = currentCart?.items?.find(i => i.id === itemId)
        
        if (!item) {
          console.error('Item not found in cart')
          cleanupLocalState(itemId)
          return
        }

        // Update local state for immediate feedback
        setQuantities(prev => ({
          ...prev,
          [itemId]: newQuantity
        }))

        // Update backend
        const updatedCart = await updateLineItem({
          lineId: itemId,
          quantity: newQuantity
        })

        if (!updatedCart) {
          throw new Error('Failed to update cart')
        }

        setCart(updatedCart)
        return // Success, exit retry loop

      } catch (err) {
        const error = err as { message?: string }
        console.error(`Error updating quantity (attempt ${retryCount + 1}):`, error)
        
        if (error?.message?.includes('not found')) {
          // Item was deleted, refresh cart
          const freshCart = await retrieveCart()
          setCart(freshCart)
          cleanupLocalState(itemId)
          return
        }

        retryCount++
        if (retryCount === maxRetries) {
          // If all retries failed, revert to server state
          const freshCart = await retrieveCart()
          if (freshCart?.items) {
            const revertedQuantities = freshCart.items.reduce<QuantityState>((acc, item) => ({
              ...acc,
              [item.id]: item.quantity
            }), {})
            setQuantities(revertedQuantities)
          }
          setCart(freshCart)
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } finally {
        setLoading(prev => ({ ...prev, [itemId]: false }))
      }
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        setLoading(prev => ({ ...prev, [itemId]: true }))

        // Get current cart state
        const currentCart = await retrieveCart()
        const itemExists = currentCart?.items?.some(item => item.id === itemId)

        if (!itemExists) {
          // If item is already gone, just update local state
          setCart(currentCart)
          cleanupLocalState(itemId)
          return
        }

        // Optimistically update UI
        setCart(prev => {
          if (!prev) return prev
          return {
            ...prev,
            items: prev.items?.filter(item => item.id !== itemId) || []
          }
        })

        // Try to delete on server
        await deleteLineItem(itemId)
        
        // Get final cart state
        const updatedCart = await retrieveCart()
        setCart(updatedCart)
        cleanupLocalState(itemId)
        return

      } catch (err) {
        const error = err as { message?: string }
        console.error(`Error removing item (attempt ${retryCount + 1}):`, error)
        
        if (error?.message?.includes('not found')) {
          // Item was already deleted, just update local state
          const freshCart = await retrieveCart()
          setCart(freshCart)
          cleanupLocalState(itemId)
          return
        }
        
        retryCount++
        if (retryCount === maxRetries) {
          // If all retries failed, refresh cart state
          const freshCart = await retrieveCart()
          setCart(freshCart)
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } finally {
        setLoading(prev => ({ ...prev, [itemId]: false }))
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Heading className="text-2xl font-semibold text-gray-900">Shopping Cart</Heading>
          <div className="flex items-center gap-x-4">
            {totalPrice > 0 && (
              <div className="text-xl font-bold text-gray-900">
                Total: ${totalPrice.toFixed(2)}
              </div>
            )}
            <button
              onClick={handleCheckout}
              className="bg-[#0093D0] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={totalPrice === 0}
            >
              Checkout Selected
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <Table>
          <Table.Header className="border-t-0">
            <Table.Row className="text-sm text-gray-600">
              <Table.HeaderCell className="!pl-0 w-10"></Table.HeaderCell>
              <Table.HeaderCell className="font-semibold">Product</Table.HeaderCell>
              <Table.HeaderCell className="font-semibold">Model</Table.HeaderCell>
              <Table.HeaderCell className="font-semibold">Quantity</Table.HeaderCell>
              <Table.HeaderCell className="text-right font-semibold">Price</Table.HeaderCell>
              <Table.HeaderCell className="w-10"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items
              ? items.sort((a, b) => {
                  const productIdA = a.variant?.product?.id ?? ""
                  const productIdB = b.variant?.product?.id ?? ""
                  if (productIdA !== productIdB) {
                    return productIdA.localeCompare(productIdB)
                  }
                  const variantIdA = a.variant?.id ?? ""
                  const variantIdB = b.variant?.id ?? ""
                  return variantIdA.localeCompare(variantIdB)
                })
                .map((item) => {
                  const product = item.variant?.product
                  const quantity = quantities[item.id] || item.quantity
                  return (
                    <Table.Row key={item.id} className="border-b last:border-b-0">
                      <Table.Cell className="!pl-0 w-10">
                        <input
                          type="checkbox"
                          checked={selectedItems[item.id] || false}
                          onChange={() => handleCheckItem(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={loading[item.id]}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-x-4 items-center">
                          <div className="w-16 h-16 flex-shrink-0">
                            {product?.thumbnail && (
                              <img 
                                src={product.thumbnail} 
                                alt={product?.title || ''} 
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {product?.subtitle || 'Unnamed Product'}
                            </h3>
                            {product?.subtitle && (
                              <p className="text-sm text-gray-500">
                                {product.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="text-sm text-gray-600">
                          {item.variant?.title ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                              {item.variant.title}
                            </span>
                          ) : '-'}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-x-2 bg-gray-50 p-2 rounded-lg">
                          <button
                            onClick={() => {
                              if (quantity > 1) {
                                handleUpdateQuantity(item.id, quantity - 1)
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center border rounded-md bg-white hover:bg-gray-100 transition-colors"
                            disabled={quantity <= 1 || loading[item.id]}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              if (val > 0) {
                                handleUpdateQuantity(item.id, val)
                              }
                            }}
                            className="w-16 text-center border rounded-md p-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading[item.id]}
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded-md bg-white hover:bg-gray-100 transition-colors"
                            disabled={loading[item.id]}
                          >
                            +
                          </button>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <span className="text-sm font-medium text-gray-900">
                          ${((item.unit_price || 0) * quantity / 100).toFixed(2)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          disabled={loading[item.id]}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
