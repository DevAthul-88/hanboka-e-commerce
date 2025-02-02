import { createContext, useContext, useState, useEffect } from "react"
import { useCart } from "../cart/hooks/useCart"

// Types
interface CartContextType {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (slug: string, quantity: number) => Promise<void>
  removeFromCart: (slug: string) => Promise<void>
  isLoading: boolean
  counter: number
  setCounter: () => void
  cartCount: number
  setCartCount: (count: number) => void
}

// Create context with initial default values
const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [counter, setCounter] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [productSlugs, setProductSlugs] = useState<string[]>([])

  // Add fallback defaults for useCart
  const {
    cartItems = [], // Provide empty array as default
    addToCart: addToCartBase = async () => {}, // Empty function as fallback
    removeFromCart: removeFromCartBase = async () => {}, // Empty function as fallback
    isLoading: cartLoading = false, // Default to not loading
  } = useCart() || {} // Add fallback empty object if useCart returns undefined

  // Update cart count whenever items change
  useEffect(() => {
    try {
      if (!Array.isArray(cartItems)) {
        setCartCount(0)
        return
      }

      // Calculate total quantity across all items
      const totalQuantity = cartItems.reduce((total, item) => {
        return total + (item?.quantity || 0)
      }, 0)

      const uniqueProductCount = new Set(cartItems.map((item) => item.productId)).size

      setCartCount(uniqueProductCount)

      // Update slugs list
      const slugs = cartItems.map((item) => item?.productSlug).filter(Boolean)
      if (JSON.stringify(slugs) !== JSON.stringify(productSlugs)) {
        setProductSlugs(slugs)
      }
    } catch (error) {
      console.error("Error processing cart items:", error)
      setProductSlugs([])
      setCartCount(0)
    }
  }, [cartItems]) // Only depend on items

  const addToCart = async (slug: string, quantity: number) => {
    try {
      await addToCartBase({ productSlug: slug, quantity })
      setIsOpen(true)
      // Cart count will be updated by the useEffect when items change
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const removeFromCart = async (slug: string) => {
    try {
      await removeFromCartBase({ productSlug: slug })
      // Cart count will be updated by the useEffect when items change
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const contextValue: CartContextType = {
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addToCart,
    removeFromCart,
    isLoading: cartLoading,
    counter,
    setCounter: () => setCounter((prev) => prev + 1),
    cartCount,
    setCartCount,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider")
  }
  return context
}
