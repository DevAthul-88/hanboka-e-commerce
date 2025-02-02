import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, Loader2 } from "lucide-react"
import { useCartContext } from "./CartContext"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { useSession } from "@blitzjs/auth"
import { useQuery } from "@blitzjs/rpc"
import getProductsBySlug from "../cart/queries/getProductsBySlug"
import Link from "next/link"
import { useCart } from "../cart/hooks/useCart"
import updateCartItemQuantity from "../cart/queries/updateCartItemQuantity"

interface Product {
  id: number
  name: string
  price: number
  slug: string
  imageUrl?: string
}

const CartSheet = () => {
  const { isOpen, closeCart } = useCartContext()
  const currentUser = useSession()
  const { cartItems, isLoading: isCartLoading, removeFromCart, refreshCart } = useCart()
  const [loadingItemStates, setLoadingItemStates] = useState<{ [key: string]: boolean }>({})

  const slugs = cartItems
    .map((item) => item.productSlug)
    .filter((slug) => slug !== undefined && slug !== null)
  const [productData] = useQuery(getProductsBySlug, { slugs }, { enabled: slugs.length > 0 })

  const products = productData?.products || []

  const cartItemsWithProducts = cartItems.map((item) => ({
    ...item,
    product: products.find((p) => p.slug === item.productSlug),
  }))

  const total = cartItemsWithProducts.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleQuantityChange = async (
    slug: string,
    delta: number,
    currentQuantity: number,
    id: number
  ) => {
    setLoadingItemStates((prev) => ({ ...prev, [slug]: true }))

    try {
      const newQuantity = Math.max(1, currentQuantity + delta)

      if (currentUser?.userId) {
        await updateCartItemQuantity({
          slug,
          userId: currentUser.userId,
          quantity: newQuantity,
          productId: id,
        })
      } else {
        const storedCart = JSON.parse(localStorage.getItem("cart_items") || "[]")
        const updatedCart = storedCart.map((item) =>
          item.productSlug === slug ? { ...item, quantity: newQuantity } : item
        )
        localStorage.setItem("cart_items", JSON.stringify(updatedCart))
      }
      await refreshCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setLoadingItemStates((prev) => ({ ...prev, [slug]: false }))
    }
  }

  const handleRemoveItem = async (slug: string) => {
    setLoadingItemStates((prev) => ({ ...prev, [slug]: true }))

    try {
      await removeFromCart({ productSlug: slug })
      await refreshCart()
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setLoadingItemStates((prev) => ({ ...prev, [slug]: false }))
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4 h-[calc(100vh-12rem)] overflow-y-auto">
          {isCartLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : cartItemsWithProducts.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty</div>
          ) : (
            cartItemsWithProducts.map((item) => (
              <div
                key={item.productSlug}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name || "Product"}
                        className="object-cover h-full w-full rounded"
                      />
                    ) : (
                      <img
                        src="/api/placeholder/64/64"
                        alt="Product placeholder"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.product?.name || "Unknown Product"}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.product?.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {loadingItemStates[item.productSlug] ? (
                    <div className="h-8 w-24 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.productSlug, -1, item.quantity, item?.id)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.productSlug, 1, item.quantity, item?.id)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveItem(item.productSlug)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {cartItemsWithProducts.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <Link href={"/checkout"}>
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
