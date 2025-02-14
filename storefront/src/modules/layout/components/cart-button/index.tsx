import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  if (!cart) {
    return <CartDropdown cart={null} />
  }

  return <CartDropdown cart={cart} />
}