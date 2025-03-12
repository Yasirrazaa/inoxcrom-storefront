"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.AdminProduct | HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  disabled?: boolean
  onVariantChange?: (variant: HttpTypes.AdminProductVariant) => void
}

const isAdminProduct = (product: HttpTypes.AdminProduct | HttpTypes.StoreProduct): product is HttpTypes.AdminProduct => {
  return 'status' in product
}

const isAdminVariant = (variant: any): variant is HttpTypes.AdminProductVariant => {
  return 'allow_backorder' in variant && 'inventory_quantity' in variant
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"] | HttpTypes.AdminProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
  onVariantChange,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [errorMessage, setErrorMessage] = useState("")
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options and notify parent
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variant = product.variants[0]
      const variantOptions = optionsAsKeymap(variant.options)
      setOptions(variantOptions ?? {})
      if (isAdminVariant(variant) && onVariantChange) {
        onVariantChange(variant)
      }
    }
  }, [product.variants, onVariantChange])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })

    // Notify parent component of variant change
    if (variant && isAdminVariant(variant) && onVariantChange) {
      onVariantChange(variant)
    }

    return variant
  }, [product.variants, options, onVariantChange])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])


  
  const isInStock = useMemo(() => {
    if (!selectedVariant) return false
    if (errorMessage?.toLowerCase().includes('out of stock')) return false
    if (!selectedVariant.manage_inventory) return true
    return (selectedVariant.inventory_quantity ?? 0) > 0
  }, [selectedVariant, errorMessage])

  const inventoryQuantity = useMemo(() => {
    if (!selectedVariant || !selectedVariant.manage_inventory) return undefined
    return selectedVariant.inventory_quantity ?? 0
  }, [selectedVariant])

  // Get inventory quantity for the selected variant
  const getInventoryQuantity = (variant: HttpTypes.StoreProductVariant | HttpTypes.AdminProductVariant | undefined) => {
    if (!variant) return 0
    if (isAdminVariant(variant) && variant.manage_inventory && !variant.allow_backorder) {
      return variant.inventory_quantity ?? 0
    }
    return 0
  }

  // Effect to reset quantity if variant changes
  useEffect(() => {
    if (!selectedVariant) return

    // If inventory is not managed or quantity is greater than 0
    if (!selectedVariant.manage_inventory || (selectedVariant.inventory_quantity ?? 0) > 0) {
      const maxQuantity = selectedVariant.manage_inventory 
        ? selectedVariant.inventory_quantity ?? 1
        : Infinity

      // If current quantity exceeds available inventory
      if (quantity > maxQuantity) {
        setQuantity(maxQuantity)
      }
    } else {
      // If variant is out of stock
      setQuantity(1)
    }
  }, [selectedVariant, quantity])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // Handle quantity changes from input
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    
    if (value === '') {
      setQuantity(1)
    } else {
      const newQuantity = parseInt(value)
      if (newQuantity >= 1) {
        updateQuantity(newQuantity)
      }
    }
  }

  // Handle quantity changes from buttons
  const updateQuantity = (newQuantity: number) => {
    if (!selectedVariant) {
      setErrorMessage("Please select a variant first")
      return
    }

    if (newQuantity < 1) {
      setQuantity(1)
      setErrorMessage("")
      return
    }

    let maxQuantity = Infinity
    let inventoryManaged = false

    if (isAdminVariant(selectedVariant)) {
      if (selectedVariant.manage_inventory && !selectedVariant.allow_backorder) {
        maxQuantity = selectedVariant.inventory_quantity ?? 0
        inventoryManaged = true
      }
    } else {
      const storeVariant = selectedVariant as HttpTypes.StoreProductVariant
      if (storeVariant.manage_inventory && !storeVariant.allow_backorder) {
        maxQuantity = storeVariant.inventory_quantity ?? 0
        inventoryManaged = true
      }
    }

    if (inventoryManaged) {
      if (maxQuantity === 0) {
        setQuantity(1)
        setErrorMessage("This item is out of stock")
      } else if (newQuantity > maxQuantity) {
        setQuantity(maxQuantity)
        setErrorMessage(`Only ${maxQuantity} items available`)
      } else {
        setQuantity(newQuantity)
        setErrorMessage("")
      }
    } else {
      setQuantity(newQuantity)
      setErrorMessage("")
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || !isInStock) return

    setIsAdding(true)

    if (isAdminProduct(product) && product.status !== "published") {
      console.warn("Cannot add variant from unpublished product to cart")
      setIsAdding(false)
      return
    }

    addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })
    .then(() => {
      setIsAdding(false)
      setErrorMessage("")
    })
    .catch((err) => {
      console.error("Error adding to cart:", err)
      // Check for sales channel error
      if (err.message && err.message.includes("Sales channel")) {
        setErrorMessage("This item is currently out of stock")
      } else {
        setErrorMessage("Error adding to cart. Please try again.")
      }
      setIsAdding(false)
    })
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option: any) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={(optionId: string, value: string) => {
                        setOptionValue(optionId, value);
                      }}
                      title={option.title ?? ""}
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {/* Quantity Controls */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-700">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <button
              className="px-3 py-2 border-r hover:bg-gray-50"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1 || !isInStock || !selectedVariant}
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
                  updateQuantity(val)
                }
              }}
              className="w-16 text-center border rounded-md p-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isInStock || !selectedVariant}
            />
            <button
              className="px-3 py-2 border-l hover:bg-gray-50"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={!isInStock || !selectedVariant}
            >
              +
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-2 w-full">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !!disabled || !!isAdding || !isValidVariant || !isInStock}
            variant={!selectedVariant || !options ? "secondary" : !isInStock ? "danger" : "primary"}
            className={`flex-1 h-12 font-medium shadow-sm transition-all duration-200 ${
              (!selectedVariant || !options || !isValidVariant || !isInStock)
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90'
            }`}
            isLoading={isAdding}
          >
            {!selectedVariant || !options
              ? "Select variant"
              : !isValidVariant
                ? "Invalid selection"
                : !isInStock
                  ? "Out of stock"
                  : `Add to cart${quantity > 1 ? ` (${quantity})` : ''}`}
          </Button>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={isInStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView || false}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          updateQuantity={updateQuantity}
          errorMessage={errorMessage}
        />
      </div>
    </>
  )
}
