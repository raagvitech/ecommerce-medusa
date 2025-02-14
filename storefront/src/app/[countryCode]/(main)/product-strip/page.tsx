import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductStrip from "@modules/product-strip/templates"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function ProductStripPage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <ProductStrip
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
