export interface CartItem {
  id: number
  productSlug: string
  quantity: number
  productId: number
  userId: number
  product?: Product
}

export interface Product {
  id: number
  slug: string
  name: string
  price: number
}

export interface AddToCartInput {
  productSlug: string
  quantity: number
  size: string
}

export interface RemoveFromCartInput {
  productSlug: string
}

export interface CartService {
  items: CartItem[]
  isLoading: boolean
  addToCart: (input: AddToCartInput) => Promise<void>
  removeFromCart: (input: RemoveFromCartInput) => Promise<void>
  refreshCart: () => Promise<void>
  counter: () => Number
}
