import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAdminAuthToken } from "@lib/services/admin-auth"

async function getStoreInventory(handle: string) {
  const queryParams = new URLSearchParams({
    handle,
    fields: "+variants.inventory_quantity",
  })

  try {
    const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
      `/store/products?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      }
    )

    return response.products?.[0]?.variants || []
  } catch (error) {
    console.error('Error fetching store inventory:', error)
    return []
  }
}

export async function getProduct(handle: string) {
  try {
    const token = await getAdminAuthToken()
    
    // Get admin product data
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

    // Get store inventory data
    const storeVariants = await getStoreInventory(handle)
    const adminProduct = products[0]

    // Merge inventory data
    if (adminProduct.variants && storeVariants.length > 0) {
      adminProduct.variants = adminProduct.variants.map(variant => {
        const storeVariant = storeVariants.find(v => v.id === variant.id)
        if (storeVariant) {
          return {
            ...variant,
            inventory_quantity: storeVariant.inventory_quantity,
            manage_inventory: storeVariant.manage_inventory,
          }
        }
        return variant
      })
    }

    return { product: adminProduct }
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
