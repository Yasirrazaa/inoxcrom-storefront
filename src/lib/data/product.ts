import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAdminAuthToken } from "@lib/services/admin-auth"

export async function getProduct(handle: string) {
  try {
    const token = await getAdminAuthToken()

    const { products } = await sdk.client.fetch<{ products: HttpTypes.AdminProduct[] }>(
      `/admin/products?handle=${handle}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )

    if (!products || products.length === 0) {
      throw new Error("Product not found")
    }

    return { product: products[0] }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function getProductById(id: string) {
  try {
    const token = await getAdminAuthToken()

    const product = await sdk.client.fetch<HttpTypes.AdminProduct>(
      `/admin/products/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )

    if (!product) {
      throw new Error("Product not found")
    }

    return { product }
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    throw error
  }
}
