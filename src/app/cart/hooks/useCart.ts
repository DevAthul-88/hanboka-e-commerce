import { useQuery, useMutation } from "@blitzjs/rpc"
import { useSession } from "@blitzjs/auth"
import { useEffect, useState } from "react"
import {
  CartItem,
  CartService,
  AddToCartInput,
  RemoveFromCartInput,
} from "../../../../types/cart/types"
import addToCartMutation from "../mutations/addToCart"
import removeFromCartMutation from "../mutations/removeFromCart"
import getCart from "../queries/getCart"

const CART_STORAGE_KEY = "cart_items"

export const useCart = (): CartService => {
  const session = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [counter, setCoutner] = useState(0)

  // Fetch cart items from the database if the user is logged in
  const [{ cartItems: queryCartItems } = { cartItems: [] }, { refetch }] = useQuery(
    getCart,
    {},
    {
      enabled: session.userId != null && !session.isLoading, // Only fetch cart if user is authenticated
    }
  )

  const [addToCartMutate] = useMutation(addToCartMutation)
  const [removeFromCartMutate] = useMutation(removeFromCartMutation)

  useEffect(() => {
    if (session.userId && queryCartItems) {
      // Check if cart items have changed
      if (JSON.stringify(cartItems) !== JSON.stringify(queryCartItems)) {
        setCartItems(queryCartItems)
      }
    } else if (!session.isLoading) {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        // Check if cart items have changed
        if (JSON.stringify(cartItems) !== JSON.stringify(parsedCart)) {
          setCartItems(parsedCart)
        }
      }
    }
  }, [session.userId, session.isLoading, queryCartItems, cartItems]) // Ensure cartItems and queryCartItems comparison

  // Add item to cart
  const addToCart = async ({ productSlug, quantity, size = "M" }: AddToCartInput) => {
    if (session.userId) {
      const userId = session.userId
      // Add to database if the user is logged in
      await addToCartMutate({ productSlug, quantity, userId, size })
      await refetch() // Refetch cart items from the server if necessary
    } else {
      // User is not logged in, store cart items in session or local storage
      const currentCart = [...cartItems]
      const existingItem = currentCart.find((item) => item.productSlug === productSlug)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        currentCart.push({
          id: Date.now(), // Temporary ID for session storage
          productSlug,
          quantity,
          productId: -1, // Placeholder value
          userId: -1, // Placeholder value
          size,
        })
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart)) // To persist across sessions

      setCartItems(currentCart) // Update cartItems locally
    }
  }

  // Remove item from cart
  const removeFromCart = async ({ productSlug }: RemoveFromCartInput) => {
    if (session.userId) {
      // Remove from database if user is logged in
      await removeFromCartMutate({ productSlug })
      await refetch() // Refetch cart items from the server if necessary
    } else {
      // User is not logged in, update session or local storage
      const updatedCart = cartItems.filter((item) => item.productSlug !== productSlug)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart)) // To persist across sessions
      setCartItems(updatedCart) // Update cartItems locally
    }
  }

  // Refresh cart
  const refreshCart = async () => {
    if (session.userId) {
      await refetch() // Refetch from the server if user is logged in
    } else {
      // If user is not logged in, load from session or local storage
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    }
    setCoutner(counter + 1)
  }

  return {
    cartItems,
    isLoading: session.isLoading,
    addToCart,
    removeFromCart,
    refreshCart,
    counter,
  }
}
