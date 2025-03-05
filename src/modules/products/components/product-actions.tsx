"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { addToCart } from "@lib/data/cart"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

type ProductVariant = {
  id: string
  manage_inventory?: boolean
  inventory_quantity?: number
}

type ProductActionsProps = {
  product: {
    title: string
  }
  region: any
  selectedVariant: ProductVariant | null
  countryCode: string
}

const ProductActions = ({
  product,
  region,
  selectedVariant,
  countryCode
}: ProductActionsProps) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isOutOfStock, setIsOutOfStock] = useState(false)

  // Check inventory status whenever variant or quantity changes
  const getInventoryQuantity = (variant: ProductVariant | null): number => {
    if (!variant || !variant.manage_inventory || variant.inventory_quantity === undefined) {
      return Infinity
    }
    return variant.inventory_quantity
  }

  useEffect(() => {
    if (selectedVariant) {
      const inventoryQuantity = getInventoryQuantity(selectedVariant)
      setIsOutOfStock(
        selectedVariant.manage_inventory === true && inventoryQuantity === 0
      )
    }
  }, [selectedVariant])


  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select all options');
      return;
    }
    
    setIsAdding(true);
    
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity,
        countryCode: countryCode
      })
      
      toast.success(`Added ${quantity} ${product.title} to cart`);
      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Error adding to cart. Please try again later.');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-4">
        <div className="flex items-center border rounded-md">
          <button
            className="p-2 border-r disabled:opacity-50"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isAdding || isOutOfStock}
          >
            -
          </button>
          <span className="px-6 py-2">{quantity}</span>
          <button
            className="p-2 border-l disabled:opacity-50"
            onClick={() => setQuantity(quantity + 1)}
            disabled={
              isAdding ||
              isOutOfStock ||
              (selectedVariant?.manage_inventory &&
               selectedVariant?.inventory_quantity !== undefined &&
               quantity >= selectedVariant.inventory_quantity)
            }
          >
            +
          </button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock || !selectedVariant || isAdding}
        isLoading={isAdding}
        className={`w-full h-10 ${isOutOfStock ? 'bg-gray-200 cursor-not-allowed' : ''}`}
      >
        {isOutOfStock 
          ? "Out of Stock" 
          : !selectedVariant 
            ? "Select Options" 
            : isAdding 
              ? "Adding..." 
              : "Add to Cart"
        }
      </Button>

      {selectedVariant && (
        <>
          {isOutOfStock ? (
            <p className="text-sm font-medium text-red-600">
              Currently out of stock
            </p>
          ) : getInventoryQuantity(selectedVariant) <= 5 && getInventoryQuantity(selectedVariant) > 0 && (
            <p className="text-sm text-yellow-600">
              Only {getInventoryQuantity(selectedVariant)} left in stock
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default ProductActions
