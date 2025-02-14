import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container flex flex-col px-3 py-10 md:py-10">
{/* Header section with title and View All link (original position) */}
<div className="mb-5 flex flex-wrap items-center gap-x-6">
  <Text className="text-[2rem] font-medium leading-[2.25rem] flex-shrink-0">
    {collection.title}
  </Text>
  <div className="hidden md:flex">
    <InteractiveLink href={`/collections/${collection.handle}`}>
      View all
    </InteractiveLink>
  </div>
</div>




      {/* Product Grid */}
      <ul className="ais-Hits-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-2 lg:gap-x-6 lg:gap-y-8">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>

      {/* "View All" link for medium screens (centered below products) */}
      <div className="mt-6 md:hidden flex justify-center">
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
    </div>
  )
}
