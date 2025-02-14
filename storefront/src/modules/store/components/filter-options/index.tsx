// @ts-nocheck
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { Range } from "react-range"
import { ChevronDown } from "lucide-react"

const MIN_PRICE = 0
const MAX_PRICE = 200

const FilterProducts = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const BackendUrl = process.env.MEDUSA_BACKEND_URL
  const publishableApiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY


  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagsOpen, setIsTagsOpen] = useState(true)
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; count: number }>>([
    { name: "Best Seller", count: 9 },
    { name: "New Arrival", count: 15 },
  ])
  const [availableCollections, setAvailableCollections] = useState<Array<{ id: string; title: string }>>([])
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)


  useEffect(() => {
    console.log("Inside use Effect", BackendUrl, publishableApiKey)
    fetch(`https://basic-medusa-production.up.railway.app/store/product-tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': `${publishableApiKey}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data?.product_tags) {
        const tags = data.product_tags.map(tag => ({
          name: tag.value, 
          count: tag.products.length
        }));
        setAvailableTags(tags);
      }
    })
    .catch(error => console.error('Error:', error));

    fetch(`https://basic-medusa-production.up.railway.app/store/collections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': `${publishableApiKey}`
      }
    })
    .then(response => response.json())
    .then(data => {
      {
        if (data?.collections) {
          const collections = data.collections.map(collection => ({
            id: collection.id,
            title: collection.title
          }));
          setAvailableCollections(collections);
        }
      }
    })
    .catch(error => console.error('Error:', error));

  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  const updateQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values)
    updateQueryParams("priceRange", `${values[0]}-${values[1]}`)
  }

  const handleCollectionChange = (collectionId: string) => {
    let updatedCollection = selectedCollection === collectionId ? null : collectionId;
    setSelectedCollection(updatedCollection);
  
    if (updatedCollection) {
      updateQueryParams("collections_id", updatedCollection);
    } else {
      // Remove the collection_id query parameter when deselected
      const params = new URLSearchParams(searchParams);
      params.delete("collections_id");
      router.push(`${pathname}?${params.toString()}`);
    }
  };
  

  const handleTagChange = (tag: string) => {
    let updatedTags = [...selectedTags]
    if (updatedTags.includes(tag)) {
      updatedTags = updatedTags.filter((t) => t !== tag)
    } else {
      updatedTags.push(tag)
    }

    setSelectedTags(updatedTags)
    updateQueryParams("tags", updatedTags.join(","))
  }

  return (
    <div className="p-6 bg-gray-50 ml-4 rounded-md z-50">
      <h3 className="text-xl font-semibold mb-3">Filter By</h3>
      <hr className="mb-6"/>
      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-lg mb-4 text-gray-600">Price Range</label>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex gap-2">
            <span className="text-gray-400">€</span>
            <input
              type="number"
              value={priceRange[0]}
              min={MIN_PRICE}
              max={MAX_PRICE}
              onChange={(e) => handlePriceChange([Number(e.target.value), priceRange[1]])}
              className="w-20 bg-transparent outline-none"
            />
          </div>
          <span className="text-gray-400">—</span>
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex gap-2">
            <span className="text-gray-400">€</span>
            <input
              type="number"
              value={priceRange[1]}
              min={MIN_PRICE}
              max={MAX_PRICE}
              onChange={(e) => handlePriceChange([priceRange[0], Number(e.target.value)])}
              className="w-20 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Slider */}
        <Range
          step={0.01}
          min={MIN_PRICE}
          max={MAX_PRICE}
          values={priceRange}
          onChange={(values) => handlePriceChange(values as [number, number])}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-blue-500 rounded-full absolute"
                style={{
                  left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                  right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md focus:outline-none"
            />
          )}
        />
      </div>

      {/* Tags Filter */}
      <div>
        <button
          onClick={() => setIsTagsOpen(!isTagsOpen)}
          className="flex items-center justify-between w-full text-lg mb-4"
        >
          <span className="text-gray-600">Tags</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isTagsOpen ? "transform rotate-180" : ""}`} />
        </button>
        {isTagsOpen && (
          <div className="space-y-3">
            {availableTags.map(({ name, count }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(name)}
                    onChange={() => handleTagChange(name)}
                    className="w-5 h-5 border-2 rounded-3xl text-blue-500 focus:ring-0 focus:ring-offset-0"
                  />
                </div>
                <span className="flex-1">{name}</span>
                <span className="text-gray-500">({count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Collections Filter */}
      <div className="my-6">
        <button
          onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
          className="flex items-center justify-between w-full text-lg mb-4"
        >
          <span className="text-gray-600">Collections</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isCollectionsOpen ? "transform rotate-180" : ""}`} />
        </button>
        {isCollectionsOpen && (
          <div className="space-y-3">
            {availableCollections.map(({ id, title }) => (
              <label key={id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCollection === id}
                  onChange={() => handleCollectionChange(id)}
                  className="w-5 h-5 border-2 rounded-3xl text-blue-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="flex-1">{title}</span>
              </label>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default FilterProducts