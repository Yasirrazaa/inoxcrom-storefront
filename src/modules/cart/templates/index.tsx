"use client"

import { useEffect, useState } from "react"
import { Button } from "@medusajs/ui"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { deleteLineItem, getOrSetCart, retrieveCart, updateLineItem } from "@lib/data/cart"
import { Trash2 } from "lucide-react"
import CartTotals from "@modules/common/components/cart-totals"

type CartTemplateProps = {
  cart: HttpTypes.StoreCart | null
  region: HttpTypes.StoreRegion | null
  countryCode: string
  customer: HttpTypes.StoreCustomer | null
}

const CartTemplate = ({ cart: initialCart, region, countryCode, customer }: CartTemplateProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(initialCart)
  const [updating, setUpdating] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const initCart = async () => {
      try {
        // Always try to get a fresh cart on mount
        const freshCart = await retrieveCart()
        if (!freshCart && countryCode) {
          const newCart = await getOrSetCart(countryCode)
          setCart(newCart)
        } else {
          setCart(freshCart)
        }

        // Initialize all items as selected by default
        if (freshCart?.items) {
          const initialSelectedState = freshCart.items.reduce((acc, item) => ({
            ...acc,
            [item.id]: true
          }), {})
          setSelectedItems(initialSelectedState)
        }
      } catch (error) {
        console.error("Error initializing cart:", error)
      }
    }
    
    initCart()
  }, [countryCode])

  // Debug cart changes
  useEffect(() => {
    console.log("Cart updated:", {
      id: cart?.id,
      items: cart?.items?.length,
      region: cart?.region_id
    })
  }, [cart])

  // Show empty cart state
  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center text-gray-500 mb-8">
          <Link href={`/${countryCode}`} className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">{String.fromCharCode(62)}</span>
          <span className="text-gray-700">Shopping Cart</span>
        </div>

        <div className="flex flex-col items-center gap-6 py-16 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
            <svg className="w-8 h-8 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
            <Link href={`/${countryCode}/catalog`}>
              <Button>Browse products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const updateItem = async (lineId: string, quantity: number) => {
    setUpdating(true)
    try {
      // Get current cart state to preserve product information
      const currentCart = await retrieveCart()
      const currentItem = currentCart?.items?.find(item => item.id === lineId)
      
      if (!currentItem) {
        console.error("Item not found in cart")
        return
      }

      const updatedCart = await updateLineItem({
        lineId,
        quantity,
      })

      if (updatedCart) {
        // Merge the updated cart with current product information
        const mergedCart = {
          ...updatedCart,
          items: updatedCart.items?.map(item => {
            if (item.id === lineId) {
              return {
                ...item,
                variant: currentItem.variant,
                subtitle: currentItem.subtitle
              }
            }
            return item
          })
        }
        setCart(mergedCart)
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (lineId: string) => {
    setUpdating(true)
    try {
      await deleteLineItem(lineId)
      const updatedCart = await getOrSetCart(countryCode)
      setCart(updatedCart)
    } catch (error) {
      console.error("Error removing cart item:", error)
    } finally {
      setUpdating(false)
    }
  }

  const currencyCode = region?.currency_code?.toUpperCase() ?? 'AUD'

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center text-gray-500 mb-8">
        <Link href={`/${countryCode}`} className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">{String.fromCharCode(62)}</span>
        <span className="text-gray-700">Shopping Cart</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {cart.items.map((item) => {
              const product = item.variant?.product
              return (
                <div key={item.id} className="flex gap-4 bg-white p-6 rounded-lg shadow-lg">
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedItems[item.id] || false}
                      onChange={() => {
                        setSelectedItems(prev => ({
                          ...prev,
                          [item.id]: !prev[item.id]
                        }))
                      }}
                    />
                  </div>
                  
                  {/* Product Image */}
                  <div className="w-24 h-24 relative">
                    <img
                      src={product?.thumbnail || item.thumbnail || '/placeholder-image.png'}
                      alt={product?.title || 'Product image'}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">
                      {item?.subtitle || 'Unknown Product'}
                    </h3>
                    {product?.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.subtitle}
                      </p>
                    )}
                    {item?.title && (
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          {item.title}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-x-2 bg-gray-50 p-2 rounded-lg">
                        <button
                          onClick={() => updateItem(item.id, Math.max(0, (item.quantity || 1) - 1))}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border rounded-md bg-white hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (val > 0) {
                              updateItem(item.id, val)
                            }
                          }}
                          className="w-16 text-center border rounded-md p-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={updating}
                        />
                        <button
                          onClick={() => updateItem(item.id, (item.quantity || 1) + 1)}
                          disabled={updating}
                          className="w-8 h-8 flex items-center justify-center border rounded-md bg-white hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating}
                        className="text-red-500 hover:text-red-600 disabled:opacity-50 flex items-center gap-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right space-y-1">
                    <div>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {currencyCode} {((item.unit_price || 0) ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {currencyCode} {((item.unit_price * item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <button
                onClick={() => {
                  const allSelected = cart?.items?.every(item => selectedItems[item.id])
                  const newSelectedState = cart?.items?.reduce((acc, item) => ({
                    ...acc,
                    [item.id]: !allSelected
                  }), {})
                  setSelectedItems(newSelectedState || {})
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {cart?.items?.every(item => selectedItems[item.id])
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            
            {cart && <CartTotals totals={cart} selectedItems={selectedItems} />}

            <Button
              className="w-full mt-6 relative"
              disabled={updating || !Object.values(selectedItems).some(v => v)}
              onClick={async () => {
                let errorMessage: string | null = null;
                const selectedCount = Object.values(selectedItems).filter(v => v).length
                const totalCount = cart?.items?.length || 0
                
                if (totalCount !== selectedCount) {
                  const confirmed = window.confirm(
                    `You have selected ${selectedCount} out of ${totalCount} items. Unselected items will be removed from your cart. Do you want to continue?`
                  )
                  if (!confirmed) return
                }
                
                try {
                  setUpdating(true)
                  
                  // Update quantities and remove unselected items
                  const updatePromises = cart?.items
                    ?.filter(item => !selectedItems[item.id])
                    .map(item => deleteLineItem(item.id)) || []
                  
                  await Promise.all(updatePromises)
                  
                  // Get fresh cart after updates
                  const updatedCart = await retrieveCart()
                  setCart(updatedCart)
                  
                  // Proceed to checkout
                  if (countryCode) {
                    window.location.href = `/${countryCode}/checkout`
                  }
                } catch (error) {
                  console.error("Error preparing cart for checkout:", error)
                  errorMessage = "There was an error preparing your cart for checkout. Please try again."
                  alert(errorMessage)
                } finally {
                  setUpdating(false)
                }
              }}
            >
              {updating ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Preparing Cart...
                </div>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default CartTemplate
