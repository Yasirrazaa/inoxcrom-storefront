import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProduct, getProductById } from "@lib/data/product"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // Just return empty array for now since we're using dynamic routes
    return []
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  // First get product by handle to get its ID
  const initialProduct = await getProduct(handle)
  if (!initialProduct.product) {
    notFound()
  }

  // Then get complete product data by ID
  const productRes = await getProductById(initialProduct.product.id)
  const product = productRes.product

  return {
    title: `${product.title} | Inoxcrom Store`,
    description: product.description || product.title,
    openGraph: {
      title: `${product.title} | Inoxcrom Store`,
      description: product.description || product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  // First get product by handle to get its ID
  const initialProduct = await getProduct(params.handle)
  if (!initialProduct.product) {
    notFound()
  }

  // Then get complete product data by ID
  const productRes = await getProductById(initialProduct.product.id)
  const product = productRes.product

  return (
    <ProductTemplate
      product={product}
      region={region}
    />
  )
}
