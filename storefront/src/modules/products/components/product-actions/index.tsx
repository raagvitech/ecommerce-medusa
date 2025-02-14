'use client'

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import MobileActions from "./mobile-actions"
import { ChevronDown, ChevronUp, Check } from "lucide-react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const CustomQuantitySelector = ({ value, onChange, disabled }: { 
  value: number, 
  onChange: (val: number) => void, 
  disabled?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const spaceBelow = windowHeight - buttonRect.bottom
    const spaceAbove = buttonRect.top
    const dropdownHeight = 250

    const position = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom'
    setDropdownPosition(position)

    if (listRef.current) {
      const optionHeight = 36
      const scrollPosition = Math.max(0, (value - 3) * optionHeight)
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = scrollPosition
        }
      })
    }
  }, [isOpen, value])

  const getAllOptions = () => {
    return Array.from({ length: 100 }, (_, i) => i + 1)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'
        }`}
        disabled={disabled}
        data-testid="quantity-dropdown"
      >
        <span className="text-gray-900 text-sm">{value}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div 
          className={`fixed z-50 w-[inherit] bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden
            ${dropdownPosition === 'top' ? 'mb-2' : 'mt-2'}`}
          style={{
            position: 'fixed',
            width: buttonRef.current?.offsetWidth,
            ...(dropdownPosition === 'top' 
              ? { bottom: window.innerHeight - (buttonRef.current?.getBoundingClientRect().top || 0) } 
              : { top: buttonRef.current?.getBoundingClientRect().bottom || 0 }),
            left: buttonRef.current?.getBoundingClientRect().left
          }}
        >
          <div 
            ref={listRef}
            className="max-h-[250px] overflow-y-auto scrollbar-hide"
          >
            {getAllOptions().map((num) => (
              <button
                key={num}
                onClick={() => {
                  onChange(num)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center justify-between ${
                  value === num ? 'bg-gray-100' : ''
                }`}
              >
                <span>{num}</span>
                {value === num && <Check className="w-4 h-4 text-gray-600" />}
              </button>
            ))}
          </div>
          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  useEffect(() => {
    if (product.variants?.length === 1) {
      // Single variant case
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    } else if (product.options) {
      const optionsMap: Record<string, string> = {}

      // Handle each option type
      product.options.forEach(option => {
        if (!option.values?.length) return

        if (option.title.toLowerCase() === 'size') {
          // Special handling for size options
          const sizes = option.values
          let defaultSize: string | undefined

          // Try to find medium size first
          defaultSize = sizes.find(size => 
            size.value.toLowerCase() === 'm' || 
            size.value.toLowerCase() === 'medium'
          )?.value

          // If no medium, try common sizes in order
          if (!defaultSize) {
            const commonSizes = ['l', 'large', 's', 'small']
            for (const size of commonSizes) {
              const found = sizes.find(s => s.value.toLowerCase() === size)
              if (found) {
                defaultSize = found.value
                break
              }
            }
          }

          // If still no size found, use middle size or first available
          if (!defaultSize) {
            defaultSize = sizes[Math.floor(sizes.length / 2)]?.value || sizes[0].value
          }

          optionsMap[option.id] = defaultSize
        } else {
          // For non-size options, use first available value
          optionsMap[option.id] = option.values[0].value
        }
      })

      setOptions(optionsMap)
    }
  }, [product.variants, product.options])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder) {
      return true
    }
    return (selectedVariant.inventory_quantity ?? 0) > 0
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <div className="flex flex-col gap-y-2" ref={actionsRef}>
      <div>
        {(product.variants?.length ?? 0) >= 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              )
            })}
            <Divider className="w-[150%] -mr-10" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="w-20">
          <CustomQuantitySelector
            value={quantity}
            onChange={setQuantity}
            disabled={isAdding || !inStock || !!disabled}
          />
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!!disabled || isAdding || !isValidVariant || !inStock}
          className="w-screen h-10 flex-1 bg-[#008080] text-white px-6 py-2 rounded-xl hover:bg-teal-600 font-medium flex items-center justify-center gap-2 max-w-[theme(spacing.130)]"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            aria-hidden="true" 
            className="h-6 w-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          {isAdding ? "Adding..." : "Add to cart"}
        </Button>
      </div>

      {/* <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      /> */}
    </div>
  )
}