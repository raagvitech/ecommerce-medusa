import { Suspense } from "react";
import { listRegions } from "@lib/data/regions";
import { StoreRegion } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@modules/layout/components/cart-button";
import SideMenu from "@modules/layout/components/side-menu";
import { Search, User } from "lucide-react";

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions);

  return (
    <>
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 h-16 mx-auto border-b bg-white  border-gray-200 flex items-center justify-between px-6">
        {/* Left Side - Logo and Navigation Links */}
        <div className="flex items-center h-full">
          {/* Side Menu: visible on all screens except extra-large (≥1280px) */}
          <div className="block xl:hidden">
            <SideMenu regions={regions} />
          </div>
          <LocalizedClientLink href="/" className="text-lg font-bold flex items-center">
            <img src="/Raagvitech logo.png" alt="Power Peptides Logo" className="h-12 mr-5" />
          </LocalizedClientLink>
          {/* Desktop navigation links */}
          <nav className="hidden lg:flex gap-x-6 text-gray-700">
            <LocalizedClientLink href="/store" className="hover:opacity-50">
              Buy Products
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact" className="hover:opacity-50">
              Contact
            </LocalizedClientLink>
          </nav>
        </div>

        {/* Right Side - Icons */}
        <div className="flex items-center gap-x-4">
               {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
               <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center"
                  href="/search"
                 scroll={false}
                  data-testid="nav-search-link"
              >
                <Search size={20} />
                <span className="hidden sm:inline ml-2">Search</span>
              </LocalizedClientLink>
              )}
          <LocalizedClientLink href="/account" className="hover:opacity-50 hidden sm:inline">
            <span className="flex items-center">
              <User size={20} />
              <span className="ml-2">Log in</span>
            </span>
          </LocalizedClientLink>
          <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
        </div>
      </header>
    </>
  );
}
