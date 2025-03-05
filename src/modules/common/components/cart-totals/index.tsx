"use client"

import { HttpTypes } from "@medusajs/types"
import React from "react"

type CartTotalsProps = {
  totals: HttpTypes.StoreCart
  selectedItems: Record<string, boolean>
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals, selectedItems }) => {
  const { items, shipping_total, gift_card_total, currency_code } = totals
  const displayCurrency = currency_code?.toUpperCase() || 'AUD'

  // Calculate totals only for selected items
  const selectedTotals = React.useMemo(() => {
    const selectedLineItems = items?.filter(item => selectedItems && selectedItems[item.id]) || []
    
    const subtotal = selectedLineItems.reduce((sum, item) =>
      sum + (item.unit_price || 0) * item.quantity, 0)
    
    const discountTotal = selectedLineItems.reduce((sum, item) =>
      sum + (item.adjustments?.reduce((adj, a) => adj + (a.amount || 0), 0) || 0), 0)
    
    // Calculate tax based on the proportion of selected items
    const taxRate = totals.tax_total && totals.subtotal ? totals.tax_total / totals.subtotal : 0
    const taxTotal = Math.round(subtotal * taxRate)
    
    // Calculate shipping as is without any division

    const total = (subtotal) + (taxTotal) - (discountTotal) - (gift_card_total ? gift_card_total : 0)
    
    return {
      subtotal,
      discount_total: discountTotal,
      tax_total: taxTotal,
      total
    }
  }, [items, selectedItems, totals.tax_total, totals.subtotal, gift_card_total, shipping_total])

  const hasShipping = shipping_total && shipping_total > 0
  const subtotalDivided = selectedTotals.subtotal;
  const discountTotalDivided = selectedTotals.discount_total;
  const taxTotalDivided = selectedTotals.tax_total;
  const giftCardTotalDivided = gift_card_total ? gift_card_total : 0;
  var totalDivided = (selectedTotals.total) + (hasShipping ? shipping_total : 0);
  
  // Check if any items are selected
  const anyItemSelected = Object.values(selectedItems || {}).some(selected => selected === true);
  totalDivided = anyItemSelected ? totalDivided : 0;

  // Use totalDividedAdjusted instead of totalDivided in the JSX below
  return (
    <div className="bg-white rounded-lg">
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium" data-testid="cart-subtotal" data-value={subtotalDivided || 0}>
            {displayCurrency} {subtotalDivided.toFixed(2)}
          </span>
        </div>
        
        {/* Discount */}
        {selectedTotals.discount_total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Discount</span>
            <span
              className="text-green-600 font-medium"
              data-testid="cart-discount"
              data-value={discountTotalDivided || 0}
            >
              - {displayCurrency} {discountTotalDivided.toFixed(2)}
            </span>
          </div>
        )}

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium" data-testid="cart-taxes" data-value={taxTotalDivided || 0}>
            {displayCurrency} {taxTotalDivided.toFixed(2)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Shipping</span>
          <span
            className={shipping_total ? "font-medium" : "text-gray-500"}
            data-testid="cart-shipping"
            data-value={shipping_total || 0}
          >
            {hasShipping
              ? `${displayCurrency} ${(shipping_total).toFixed(2)}`
              : "Calculated at checkout"
            }
          </span>
        </div>

        {/* Gift Card */}
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Gift Card</span>
            <span
              className="text-green-600 font-medium"
              data-testid="cart-gift-card-amount"
              data-value={giftCardTotalDivided || 0}
            >
              - {displayCurrency} {giftCardTotalDivided.toFixed(2)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-gray-200" />

        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-semibold">Total</span>
          <div className="flex flex-col items-end">
            <span
              className="text-xl font-bold"
              data-testid="cart-total"
              data-value={totalDivided}
            >
              {displayCurrency} {totalDivided % 1 === 0 ? Math.floor(totalDivided) : totalDivided.toFixed(2)}
            </span>
            {hasShipping && (
              <span className="text-sm text-gray-500">
                (Includes shipping)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTotals

