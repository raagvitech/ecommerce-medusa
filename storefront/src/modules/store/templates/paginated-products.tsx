import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 8

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  min_price?: number
  max_price?: number
  tags?: string[]
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  priceRange,
  tags,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  priceRange?: string
  tags?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  });

  // Apply filtering based on price and tags
  const filteredProducts = products.filter((p) => {
    const { cheapestPrice } = getProductPrice({ product: p });

    // Price range check
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      const numericPrice = cheapestPrice?.original_price
        ? parseFloat(cheapestPrice.original_price.replace(/[^\d.]/g, ""))
        : 0;
      if (numericPrice && (numericPrice < min || numericPrice > max)) {
        return false;
      }
    }

    // Tags check
    if (tags) {
      const tagArray = tags.split(",").map(tag => tag.trim().toLowerCase());
      const productTagValues = p.tags?.map(tagObj => tagObj.value.toLowerCase());
      if (!productTagValues || !tagArray.some(tag => productTagValues.includes(tag))) {
        return false;
      }
    }

    return true; // Only keep products that pass all checks
  });

  // Updated total count after filtering
  const filteredCount = filteredProducts.length;
  const totalPages = Math.ceil(filteredCount / PRODUCT_LIMIT);

  console.log(filteredCount);

  return (
    <>
      <ul
        className="ais-Hits-list grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-2 lg:gap-x-6 lg:gap-y-8"
        data-testid="products-list"
      >
        {filteredProducts
          .map((p) => (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
