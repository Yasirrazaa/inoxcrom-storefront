"use client";

import { setShippingMethod, retrieveCart } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useEffect, useState } from "react"
import { CheckCircleSolid } from "@medusajs/icons";

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
  countryCode?: string
}

export default function Shipping({ cart, availableShippingMethods, countryCode }: ShippingProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  useEffect(() => {
    setIsLoadingPrices(true)
    if (availableShippingMethods?.length) {
      const promises = availableShippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }
  }, [availableShippingMethods, cart.id])

  const handleSetShippingMethod = async (id: string) => {
    if (id === shippingMethodId) return; // Don't update if same method selected
    
    setError(null)
    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id });
      // Refresh cart after setting shipping method
      const updatedCart = await retrieveCart();
      if (updatedCart) {
        // Update cart state in parent component (if needed)
        // This depends on how the parent component is managing the cart state
        // For now, assume it's being fetched on every page load
      }
    } catch (err: any) {
      setShippingMethodId(currentId)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h2" className="text-xl font-medium">
            Delivery Method
          </Heading>
          <p className="text-sm text-gray-500 mt-1">Select how you want your order delivered</p>
        </div>
        {shippingMethodId && <CheckCircleSolid className="text-green-500 h-6 w-6" />}
      </div>
      <div className="space-y-4">
        {availableShippingMethods?.map((option) => {
          const isDisabled =
            option.price_type === "calculated" &&
            !isLoadingPrices &&
            typeof calculatedPricesMap[option.id] !== "number"

          if (isDisabled) return null

          const price = option.price_type === "flat" 
            ? convertToLocale({
                amount: option.amount!,
                currency_code: cart?.currency_code ?? "USD",
                isShipping: true
              })
            : calculatedPricesMap[option.id] 
              ? convertToLocale({
                  amount: calculatedPricesMap[option.id],
                  currency_code: cart?.currency_code ?? "USD",
                  isShipping: true
                })
              : " (calculating...)"

          return (
            <label
              key={option.id}
              className={`
                flex items-center justify-between p-4 border rounded-lg cursor-pointer
                ${shippingMethodId === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="shipping_method"
                  value={option.id}
                  checked={shippingMethodId === option.id}
                  onChange={() => handleSetShippingMethod(option.id)}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <div className="font-medium text-gray-900">
                    {option.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {option.name.toLowerCase().includes('express')
                      ? 'Estimated delivery: 1-2 business days'
                      : 'Estimated delivery: 3-5 business days'}
                  </div>
                </div>
              </div>
              <div className="font-medium">
                {price}
              </div>
            </label>
          )
        })}

        {(!availableShippingMethods || availableShippingMethods.length === 0) && (
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-gray-500">No shipping methods available</p>
          </div>
        )}

        <ErrorMessage
          error={error}
          data-testid="delivery-option-error-message"
        />
      </div>
    </div>
  )
}
