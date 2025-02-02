export interface Product {
  id: number
  name: string
  price: number
  image: string
}

export interface CartItem {
  id: number
  userId: number
  productId: number
  product: Product
  quantity: number
  size?: string
  color?: string
  addedAt: Date
  productSlug: string
}

export interface CartSummary {
  subtotal: number
  shipping: number
  tax: number
  total: number
}
