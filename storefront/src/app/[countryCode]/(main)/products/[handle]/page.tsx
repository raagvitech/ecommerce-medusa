export const dynamic = "force-static" // Ensures SSG (prevents SSR)

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  try {
    console.log("Generating static params...")

    const regions = await listRegions()
    if (!regions || regions.length === 0) {
      console.warn("No regions found!")
      return []
    }

    const countryCodes = regions.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    
    if (!countryCodes || countryCodes.length === 0) {
      console.warn("No country codes found!")
      return []
    }

    const products = await listProducts({
      countryCode: "US",
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products)

    if (!products || products.length === 0) {
      console.warn("No products found!")
      return []
    }

    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle)
  } catch (error) {
    console.error("Error generating static paths:", error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: product.title,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
    revalidate: 60,  // Ensures caching but allows updates every 60s
  }
}

export default async function ProductPage({ params }: Props) {
  const { countryCode, handle } = params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={countryCode}
    />
  )
}