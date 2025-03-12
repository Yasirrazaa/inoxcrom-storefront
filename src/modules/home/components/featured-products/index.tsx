"use client"

import { listProducts } from "@lib/data/products"
import type { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"
import { useEffect, useState } from "react"

const FeaturedProducts = () => {
  const [products, setProducts] = useState<HttpTypes.AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { response } = await listProducts({
          queryParams: {
            limit: 4,
            fields: 'id,title,thumbnail,handle,status,categories,variants.id,variants.prices',
          }
        })

        if (!response.products) {
          throw new Error("No products returned from the API")
        }

        console.log('Featured products:', response.products)
        setProducts(response.products)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch products")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center text-red-500">
            Error loading products: {error}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center text-gray-500">
            No products available
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts
