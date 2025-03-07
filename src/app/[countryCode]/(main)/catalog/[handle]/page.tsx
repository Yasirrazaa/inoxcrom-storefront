import { getProduct } from "@lib/data/product"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import ProductTemplate from "@modules/products/templates"
import { listProducts } from "@lib/data/products"
import RelatedProducts from "@modules/products/components/related-products"
import { HttpTypes } from '@medusajs/types'

type Product = HttpTypes.AdminProduct

// Helper function to calculate similarity between products
const calculateSimilarityScore = (product1: Product, product2: Product): number => {
  let score = 0
  
  // Same categories
  const product1Categories = new Set(product1.categories?.map(c => c.id))
  const matchingCategories = product2.categories?.filter(c => product1Categories.has(c.id)).length || 0
  score += matchingCategories * 2
  
  // Same collection
  if (product1.collection?.id && product2.collection?.id &&
      product1.collection.id === product2.collection.id) {
    score += 2
  }
  
  // Same product type
  if (product1.type?.value && product2.type?.value &&
      product1.type.value === product2.type.value) {
    score += 1
  }
  
  return score
}

// Enable caching with 5-minute revalidation
export const revalidate = 300;

type Props = {
  params: {
    handle: string
    countryCode: string
  }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params
  const { handle, countryCode } = resolvedParams
  
  try {
    // Get product details
    const { product } = await getProduct(handle)
    
    // Get region information
    const region = await getRegion(countryCode)
    
    if (!product) {
      notFound()
    }

    // If no region is found, we'll still show the product but without regional pricing
    const regionData = region || { id: 'default', name: 'Default Region', currency_code: 'aud' }
    
    // Get related products using improved matching
    const categoryIds = product.categories?.map(cat => cat.id) || []
    const collectionId = product.collection?.id
    const productType = product.type?.value
    
    let allProducts: Product[] = []
    
    // Try to get products from same categories first
    if (categoryIds.length > 0) {
      const { response: categoryResponse } = await listProducts({
        queryParams: {
          category_id: categoryIds,
          limit: 8 // Get more to allow for filtering
        }
      })
      allProducts = categoryResponse.products
    }
    
    // If not enough products from categories, try collection
    if (allProducts.length < 5 && collectionId) {
      const { response: collectionResponse } = await listProducts({
        queryParams: {
          collection_id: [collectionId],
          limit: 8
        }
      })
      allProducts = [...allProducts, ...collectionResponse.products]
    }
    
    // If still not enough, try similar tags
    if (allProducts.length < 5 && product.tags?.length) {
      const tagIds = product.tags.map(tag => tag.id)
      const { response: tagResponse } = await listProducts({
        queryParams: {
          tags: tagIds,
          limit: 8
        }
      })
      allProducts = [...allProducts, ...tagResponse.products]
    }
    
    // If still no products, fallback to newest products
    if (allProducts.length === 0) {
      const { response } = await listProducts({
        queryParams: {
          limit: 8
        }
      })
      allProducts = response.products
    }
    
    // Remove duplicates and rank products
    const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values())
    
    // Rank products based on similarity
    const rankedProducts = uniqueProducts
      .filter(p => p.id !== product.id) // Remove current product
      .map(p => ({
        product: p,
        score: calculateSimilarityScore(product, p)
      }))
      .sort((a, b) => b.score - a.score)
      .map(p => p.product)
      .slice(0, 4) // Get top 4 products
    
    const relatedProducts = rankedProducts

    return (
      <div>
        <ProductTemplate product={product} region={regionData} countryCode={countryCode} />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} currentProductId={product.id} />
        )}
      </div>
    )
  } catch (error) {
    console.error("Error loading product page:", error)
    return notFound()
  }
}
