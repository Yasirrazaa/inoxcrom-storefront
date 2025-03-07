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

  const inStock = useMemo(() => {
    if (!selectedVariant) return false

    if (isAdminProduct(product) && isAdminVariant(selectedVariant)) {
      if (product.status !== "published") {
        return false
      }

      if (!selectedVariant.manage_inventory) {
        return true
      }

      if (selectedVariant.allow_backorder) {
        return true
      }

      return (selectedVariant.inventory_quantity || 0) > 0
    }

    const storeVariant = selectedVariant as HttpTypes.StoreProductVariant
    if (!storeVariant.manage_inventory) {
      return true
    }

    if (storeVariant.allow_backorder) {
      return true
    }

    return (storeVariant.inventory_quantity || 0) > 0
  }, [selectedVariant, product])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)

    if (isAdminProduct(product) && product.status !== "published") {
      console.warn("Cannot add variant from unpublished product to cart")
      setIsAdding(false)
      return
    }

    addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })
    .then(() => {
      setIsAdding(false)
    })
    .catch((err) => {
      console.error("Error adding to cart:", err)
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

        <div className="flex gap-2 w-full">
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="flex-1 h-12 font-medium shadow-sm"
            isLoading={isAdding}
          >
            {!selectedVariant && !options
              ? "Select variant"
              : !inStock || !isValidVariant
              ? "Out of stock"
              : "Add to cart"}
          </Button>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
