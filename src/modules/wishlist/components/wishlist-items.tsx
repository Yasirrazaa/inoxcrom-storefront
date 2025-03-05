"use client"

import { useWishlist } from "@lib/data/wishlist"
import { addToCart } from "@lib/data/cart"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { Button } from "@medusajs/ui"
import { XCircle } from "lucide-react"

type WishlistItemsProps = {
  products: HttpTypes.StoreProduct[]
  countryCode: string
  region: HttpTypes.StoreRegion
}

export default function WishlistItems({
  products,
  countryCode,
  region
}: WishlistItemsProps) {
  const { items, removeItem } = useWishlist()
  const wishlistProducts = products.filter(p => items.includes(p.id))

  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleAddToCart = (product: HttpTypes.StoreProduct) => {
    if (!product.variants || product.variants.length === 0) {
      console.log("No variants found for product", product.id);
      return;
    }
    
    console.log("Adding to cart:", { 
      productId: product.id, 
      variantId: product.variants[0].id, 
      countryCode 
    });

    setAddingToCart(product.id);
    setFeedback(null);
    
    addToCart({
      variantId: product.variants[0].id,
      quantity: 1,
      countryCode: countryCode
    })
    .then(() => {
      console.log("Successfully added to cart");
      setFeedback({ type: 'success', message: 'Added to cart' });
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      setFeedback({ type: 'error', message: 'Failed to add to cart' });
    })
    .finally(() => {
      setAddingToCart(null);
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  return (
    <div className="w-full">
      {wishlistProducts.length > 0 ? (
        <div>
          {feedback && (
            <div 
              className={`mb-4 p-4 rounded-lg text-center ${
                feedback.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {feedback.message}
            </div>
          )}
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductPreview product={product} region={region} />
                <div className="absolute top-2 right-2">
                  <Button
                    aria-label={`Remove ${product.title} from wishlist`}
                    onClick={() => removeItem(product.id)}
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                {product.variants && product.variants.length > 0 && (
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="primary"
                      className="w-full h-10"
                      onClick={() => handleAddToCart(product)}
                      isLoading={addingToCart === product.id}
                      disabled={addingToCart === product.id}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-4 py-24">
          <h2 className="text-large-semi">Your wishlist is empty</h2>
          <p className="text-base-regular">
            You don't have any products saved to your wishlist yet.
          </p>
        </div>
      )}
    </div>
  )
}
