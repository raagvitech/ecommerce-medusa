import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductStrip from "@modules/product-strip/templates"


export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function Cart() {
  const cart = await retrieveCart()
  const customer = await retrieveCustomer()

  if (!cart) {
    return notFound()
  }

  return <CartTemplate cart={cart} customer={customer} />
}