// "use client"

// import { useState } from "react"
// import { ChevronDownMini, ChevronUpMini, Beaker } from "@medusajs/icons"

// export type SortOptions = "price_asc" | "price_desc" | "created_at"

// type SortProductsProps = {
//   sortBy: SortOptions
//   setQueryParams: (name: string, value: SortOptions) => void
//   'data-testid'?: string
// }

// const sortOptions = [
//   { value: "created_at", label: "New in" },
//   { value: "price_asc", label: "Price: Low-High" },
//   { value: "price_desc", label: "Price: High-Low" },
// ]

// const SortProducts = ({ 
//   sortBy, 
//   setQueryParams, 
//   'data-testid': dataTestId 
// }: SortProductsProps) => {
//   const [isOpen, setIsOpen] = useState(false)

//   const handleSort = (value: SortOptions) => {
//     setQueryParams("sortBy", value)
//     setIsOpen(false)
//   }

//   const currentOption = sortOptions.find(option => option.value === sortBy)

//   return (
//     <div className="flex items-center justify-between">
//       {/* Filters button (visible only on mobile) */}
//       <button className="flex items-center px-4 py-2 border border-gray-200 rounded-md md:hidden">
//         <Beaker className="mr-2" /> Filters
//       </button>

//       {/* Sort Dropdown */}
//       <div className="relative">
//         <button
//           className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md min-w-[150px]"
//           onClick={() => setIsOpen(!isOpen)}
//           data-testid={dataTestId}
//         >
//           <span>{currentOption?.label || "Relevance"}</span>
//           <span className="ml-2">{isOpen ? <ChevronUpMini /> : <ChevronDownMini />}</span>
//         </button>

//         {isOpen && (
//           <div className="absolute right-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
//             {sortOptions.map((option) => (
//               <button
//                 key={option.value}
//                 className="w-full px-4 py-2 text-left hover:bg-gray-50"
//                 onClick={() => handleSort(option.value)}
//               >
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SortProducts

"use client"

import { useState } from "react"
import MobileFilter from "../mobile-filter"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  'data-testid'?: string
}

const sortOptions = [
  { value: "created_at", label: "New in" },
  { value: "price_asc", label: "Price: Low-High" },
  { value: "price_desc", label: "Price: High-Low" },
]

const SortProducts = ({ sortBy, setQueryParams, 'data-testid': dataTestId }: SortProductsProps) => {
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams("sortBy", event.target.value as SortOptions)
  }

  return (
    <div className="flex items-center justify-between w-full bg-gray-50 p-4 rounded-md">
      <span className="text-gray-500 text-sm hidden md:block">Sort By</span>
      <span className="block md:hidden"><MobileFilter /></span>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        value={sortBy}
        onChange={handleSort}
        data-testid={dataTestId}
      >
        <option value="default">Default: A-Z</option>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortProducts
