import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "../cart/hooks/useCart"
import { useCartContext } from "./CartContext"
import { Loader2 } from "lucide-react"

interface AddToCartButtonProps {
  productSlug: string
  quantity?: number
  size?: string
  stock?: number
}

const AddToCartButton = ({
  productSlug,
  quantity = 1,
  size = "M",
  stock,
}: AddToCartButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart, refreshCart } = useCart()
  const { openCart, setCounter } = useCartContext()

  const handleAddToCart = async () => {
    if (isLoading || (stock !== undefined && stock < 1)) return // Prevent clicks when loading or out of stock

    setIsLoading(true)
    try {
      await addToCart({ productSlug, quantity, size })
      await refreshCart()
      openCart()
      setCounter()
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading || (stock !== undefined && stock < 1)}
      className={cn(
        "w-full bg-black text-white rounded-none font-light text-sm py-2 transition-all duration-300 font-bold hover:opacity-80",
        isHovered ? "bg-black" : "bg-black",
        (isLoading || (stock !== undefined && stock < 1)) && "cursor-not-allowed opacity-50"
      )}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding...
        </span>
      ) : stock !== undefined && stock < 1 ? (
        "Out of Stock"
      ) : (
        "Add to Bag"
      )}
    </Button>
  )
}

export default AddToCartButton
