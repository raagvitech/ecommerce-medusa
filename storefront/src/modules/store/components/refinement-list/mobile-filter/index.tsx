// @ts-nocheck
"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Drawer } from "@medusajs/ui"
import FilterProducts from "../../filter-options"

const MobileFilter = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden"> {/* Visible only on mobile */}
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm bg-white"
      >
        <Filter className="w-5 h-5" />
        Filters
      </button>

      {/* Drawer Component */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger className="hidden" />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <FilterProducts />
          </Drawer.Body>
          <Drawer.Footer>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-blue-500 text-white rounded-md"
            >
              Apply Filters
            </button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}

export default MobileFilter
