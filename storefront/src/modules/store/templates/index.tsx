// import { Suspense } from "react"

// import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
// import RefinementList from "@modules/store/components/refinement-list"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// import PaginatedProducts from "./paginated-products"

// const StoreTemplate = ({
//   sortBy,
//   page,
//   countryCode,
// }: {
//   sortBy?: SortOptions
//   page?: string
//   countryCode: string
// }) => {
//   const pageNumber = page ? parseInt(page) : 1
//   const sort = sortBy || "created_at"

//   return (
//     <div
//       className="flex flex-col small:flex-row small:items-start py-6 content-container"
//       data-testid="category-container"
//     >
//       <RefinementList sortBy={sort} />
//       <div className="w-full">
//         <div className="mb-8 text-2xl-semi">
//           <h1 data-testid="store-page-title">All products</h1>
//         </div>
//         <Suspense fallback={<SkeletonProductGrid />}>
//           <PaginatedProducts
//             sortBy={sort}
//             page={pageNumber}
//             countryCode={countryCode}
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// export default StoreTemplate
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import FilterProducts from "../components/filter-options"
import MobileFilter from "../components/refinement-list/mobile-filter"

const StoreTemplate = ({
  sortBy,
  page,
  priceRange,
  tags,
  countryCode,
  collections_id
}: {
  sortBy?: SortOptions
  page?: string
  priceRange?: string
  tags?: string
  countryCode: string
  collections_id?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div>
    <div className="my-4 text-2xl-semi mx-6">
      <h1 data-testid="store-page-title">Products for Sale</h1>
    </div>
    <div className="mx-6 mb-6">
   Discover our expertly crafted apparel, designed for style,  comfort, and durability. Premium fashion solutions for all your wardrobe needs.
    </div>
    <div className="flex items-baseline">
      <div className="hidden small:block">
      <FilterProducts />
      </div>


    <div
      className="small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <RefinementList sortBy={sort} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            priceRange={priceRange}
            tags={tags}
            collectionId={collections_id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
    </div>
    </div>
  )
}

export default StoreTemplate
