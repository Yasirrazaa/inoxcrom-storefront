import { listProducts } from "@lib/data/products"
import CatalogContent from "@modules/products/components/catalog-content"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAdminAuthToken } from "@lib/services/admin-auth"

// Enable caching with 5-minute revalidation
export const revalidate = 300;

interface AdminCategory {
  id: string
  name: string
  handle: string
}

interface AdminCollection {
  id: string
  title: string
  handle: string
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: { countryCode: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Await params before destructuring
  const { countryCode } = await Promise.resolve(params)
  
  // Wait for search params to be resolved
  const filteredParams = Object.fromEntries(
    Object.entries(await Promise.resolve(searchParams)).filter(([_, value]) => value !== undefined)
  );

  // Get admin token first
  const token = await getAdminAuthToken();

  // Prepare query params for products
  const productsQuery: Record<string, any> = {};
  
  // Add category filter if present
  if (filteredParams.filter) {
    console.log('Filter param:', filteredParams.filter);
    
    // Get category ID from handle
    const categoryResponse = await sdk.client.fetch<{ product_categories: any[] }>(
      '/admin/product-categories',
      {
        method: "GET",
        query: { handle: [filteredParams.filter] },
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      }
    );
    
    
    const category = categoryResponse.product_categories?.[0];
    if (category) {
      console.log('Found category:', category);
      productsQuery.category_id = [category.id];
    } else {
      console.log('No category found for handle');
    }
  }


  // Then fetch all data in parallel
  const [
    productsResponse,
    collectionsData,
    categoriesData
  ] = await Promise.all([
    sdk.client.fetch<{ products: any[] }>(
      '/admin/products',
      {
        method: "GET",
        query: {
          ...productsQuery,
          expand: 'variants,variants.prices,categories',
          limit: 5000 // Set a high limit to fetch all products
        },
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      }
    ),
    sdk.client.fetch<{ collections: AdminCollection[] }>('/admin/collections', {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { revalidate: 300 }
    }),
    sdk.client.fetch<{ product_categories: AdminCategory[] }>('/admin/product-categories', {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
      next: { revalidate: 300 }
    })
  ]);

  const collections = collectionsData.collections || [];
  const categories = categoriesData.product_categories || [];
  const products = productsResponse.products || [];

  // console.log('Products response:', productsResponse);

  // // Debug output for categories and collections
  // console.log('Available data:', {
  //   collections: collections.map((c: AdminCollection) => ({ id: c.id, title: c.title, handle: c.handle })),
  //   categories: categories.map((c: AdminCategory) => ({ id: c.id, name: c.name, handle: c.handle })),
  //   products: products.map(p => ({ id: p.id, title: p.title, categories: p.categories }))
  // });

 let initialFilter = null;
 if (typeof filteredParams.filter === 'string') {
   initialFilter = filteredParams.filter;
 } else if (typeof filteredParams.category === 'string') {
   initialFilter = filteredParams.category;
 } else if (typeof filteredParams.collection === 'string') {
   initialFilter = filteredParams.collection;
 }

 // Debug output
//  console.log('Catalog page:', {
//    params: { countryCode, ...filteredParams },
//    initialFilter,
//    productCount: products.length,
//    firstProduct: products[0] ? {
//      id: products[0].id,
//      title: products[0].title,
//      handle: products[0].handle,
//      category: products[0].categories?.[0]?.name,
//      collection: products[0].collection?.title
//    } : null,
//  });

 return <CatalogContent
   products={products}
   initialFilter={initialFilter}
   storeCategories={categories}
   storeCollections={collections}
 />
}
