import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { response } = await listProducts({
    queryParams: {
      region_id: region.id,
      fields: "*variants.calculated_price",
      collection_id: product.collection_id ? [product.collection_id] : undefined,
      tag_id: product.tags?.map((t) => t.id).filter(Boolean) as string[] || [],
      is_giftcard: false,
    },
    countryCode,
  })

  if (!response?.products?.length) {
    return null
  }

  // Filter out the current product from related products
  const relatedProducts = response.products.filter(
    (responseProduct) => responseProduct.id !== product.id
  )

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="content-container flex flex-col px-3 py-10 md:py-10">
      {/* Header section */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6">
        <Text className="text-[2rem] font-medium leading-[2.25rem] flex-shrink-0">
          More from our Products
        </Text>
        <div className="hidden md:flex">
          <InteractiveLink href={`/collections/${product.collection?.handle}`}>
            View all
          </InteractiveLink>
        </div>
      </div>

      {/* Product Grid */}
      <ul className="ais-Hits-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-2 lg:gap-x-6 lg:gap-y-8">
        {relatedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>

      {/* Mobile View All link */}
      <div className="mt-6 md:hidden flex justify-center">
        <InteractiveLink href={`/collections/${product.collection?.handle}`}>
          View all
        </InteractiveLink>
      </div>
    </div>
  )
}