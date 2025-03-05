"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAdminAuthToken } from "@lib/services/admin-auth"

// Catalog page - fetch minimal product data
export const listProducts = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.AdminProductListParams
}): Promise<{
  response: { products: HttpTypes.AdminProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.AdminProductListParams
}> => {
  const limit = queryParams?.limit || 100  // Increased to load all products for client-side filtering
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam - 1) * limit

  try {
    const token = await getAdminAuthToken()

    // Make the API request using Admin API with minimal fields for catalog
    const response = await sdk.client
    .fetch<{ products: HttpTypes.AdminProduct[]; count: number }>(
      `/admin/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          // For catalog, include necessary relationships for prices and filtering
          expand: 'variants,variants.prices,categories',
          fields: 'id,title,thumbnail,handle,status,categories,variants.id,variants.prices',
          ...queryParams,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      }
    )

    const nextPage = response.count > offset + limit ? pageParam + 1 : null

    return {
      response: {
        products: response.products || [],
        count: response.count || 0,
      },
      nextPage,
      queryParams,
    }
  } catch (error) {
    console.error('Error fetching products:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
}

// Product page - fetch all product details
export const getProduct = async (handle: string): Promise<HttpTypes.AdminProduct> => {
  try {
    const token = await getAdminAuthToken()

    const response = await sdk.client
    .fetch<{ products: HttpTypes.AdminProduct[] }>(
      `/admin/products`,
      {
        method: "GET",
        query: {
          handle,
          // Request all product details and relationships
          expand: 'categories,collection,variants,variants.options,variants.prices,options,options.values,images,tags,sales_channels',
          fields: 'id,title,subtitle,status,thumbnail,handle,description,collection,categories,tags,variants,options,type,images,sales_channels,metadata,material,weight,length,height,width,hs_code,origin_country,variants.title,variants.sku,variants.prices,variants.options',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      }
    )

    if (!response.products || response.products.length === 0) {
      throw new Error(`Product with handle ${handle} not found`)
    }

    return response.products[0]
  } catch (error) {
    console.error('Error fetching product:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
}

// Fetch catalog product details by ID
export const getCatalogProductById = async (productId: string): Promise<{
  title: string
  thumbnail: string
  price: number
}> => {
  try {
    const token = await getAdminAuthToken()
    const response = await sdk.client.fetch<{ product: any }>(
      `/admin/products/${productId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      }
    )

    if (!response.product) {
      throw new Error(`Product with ID ${productId} not found`)
    }

    // Get lowest AUD price from variants
    const audPrices = response.product.variants
      .map((variant: { prices: Array<{ currency_code: string; amount: number }> }) =>
        variant.prices
          .filter((price) => price.currency_code === "aud")
          .map((price) => price.amount)
      )
      .flat()
    
    const lowestPrice = Math.min(...audPrices)  // Convert cents to dollars

    return {
      title: response.product.title,
      thumbnail: response.product.thumbnail || "",
      price: lowestPrice
    }
  } catch (error) {
    console.error('Error fetching catalog product:', error)
    throw error
  }
}

export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.AdminProductListParams
  sortBy?: SortOptions
}): Promise<{
  response: { products: HttpTypes.AdminProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.AdminProductListParams
}> => {
  const limit = queryParams?.limit || 20

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 500,
    },
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
