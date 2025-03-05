import { NextResponse } from "next/server"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type StoreProduct = HttpTypes.StoreProduct

interface FormattedProduct {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  price?: {
    amount: string
    currency_code: string
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const countryCode = searchParams.get("countryCode") || "es"

    if (!query) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      )
    }

    // Use existing product service with search query
    const { response } = await listProducts({
      queryParams: {
        limit: 12,
      },
      countryCode,
    })

    // Filter products based on search query
    const filteredProducts = response.products.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    )

    // Format the response
    const formattedProducts: FormattedProduct[] = filteredProducts.map((product: StoreProduct) => {
      const variant = product.variants?.[0]
      const price = variant?.calculated_price

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail: product.thumbnail,
        description: product.description,
        price: price ? {
          amount: typeof price === 'number' 
            ? (price).toFixed(2) 
            : price.toString(),
          currency_code: "AUD"
        } : undefined
      }
    })

    return NextResponse.json({
      products: formattedProducts,
      count: filteredProducts.length,
    })

  } catch (error: unknown) {
    console.error('Search error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: "An error occurred while searching products" },
      { status: 500 }
    )
  }
}