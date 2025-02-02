import { useState, useEffect, useRef } from "react"
import { Search, Loader2, ShoppingBag, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { invoke } from "@blitzjs/rpc"
import searchProducts from "../products/mutations/searchProducts"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProductImage {
  id: string
  url: string
  altText: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  images: ProductImage[]
  createdAt: Date
  updatedAt: Date
}

export function ProductSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setSuggestions([])
    }
  }, [isOpen])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        setIsLoading(true)
        try {
          const { products } = await invoke(searchProducts, {
            query,
            limit: 5,
          })
          setSuggestions(products)
          setFocusIndex(-1)
        } catch (error) {
          console.error("Failed to fetch suggestions:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && focusIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[focusIndex])
    }
  }

  const handleSuggestionClick = (product: Product) => {
    setQuery("")
    setIsOpen(false)
    router.push(`/products/${product.slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      setQuery("")
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hover:bg-gray-100 rounded-full w-10 h-10"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0">
          <DialogHeader className="px-4 py-3 border-b">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-3 mt-4">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </form>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="divide-y">
                {suggestions.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-4 ${
                      focusIndex === index ? "bg-gray-50" : ""
                    }`}
                  >
                    {product.images[0] ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].altText}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          ${(product.salePrice ?? product.price).toFixed(2)}
                        </span>
                        {product.salePrice && (
                          <Badge className="text-xs font-medium">
                            Save ${(product.price - product.salePrice).toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : query.length > 1 ? (
              <div className="p-8 text-center">
                <ShoppingBag className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try searching for something else</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Start typing to search products</p>
                <p className="text-gray-400 text-sm mt-1">We'll show you matching items</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
