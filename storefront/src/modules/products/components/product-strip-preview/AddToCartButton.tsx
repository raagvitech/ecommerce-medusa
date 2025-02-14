"use client"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"

export function AddToCartButton({ onClick, isAdding }: { onClick: () => void, isAdding: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={isAdding}
      className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-teal-400 flex items-center gap-1"
    >
      {isAdding ? "..." : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Add
        </>
      )}
    </button>
  )
}
