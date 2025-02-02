import db from "db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

export default async function signup(
  input: { name?: string; password?: string; email?: string; cartItems?: any[] },
  ctx: any
) {
  const blitzContext = ctx

  // Fallbacks for undefined/null values
  const name = input.name?.trim() || "Guest User"
  const email = input.email?.trim() || ""
  const password = input.password || ""
  const cartItems = Array.isArray(input.cartItems) ? input.cartItems : []

  if (!email || !password) {
    throw new Error("Email and password are required.")
  }

  // Hash the password
  const hashedPassword = await SecurePassword.hash(password)

  // Create the user in the database
  const user = await db.user.create({
    data: { name, email, hashedPassword },
  })

  // Create session for the user
  await blitzContext.session.$create({
    userId: user.id,
    role: "user",
  })

  // If the user has cart items, save them
  if (cartItems.length > 0) {
    const productSlugs = cartItems.map((item) => item.productSlug).filter(Boolean) // Ensure no null slugs

    if (productSlugs.length > 0) {
      // Fetch products from the database
      const products = await db.product.findMany({
        where: { slug: { in: productSlugs } },
        select: { id: true, slug: true },
      })

      const productMap = new Map(products.map((p) => [p.slug, p.id]))

      // Prepare cart items for insertion
      const validCartItems = cartItems
        .map((item) => {
          const productId = productMap.get(item.productSlug)
          return productId
            ? {
                userId: user.id,
                productId,
                productSlug: item.productSlug, // Ensure productSlug is included
                quantity: item.quantity || 1, // Default quantity
                size: item.size || "M", // Default size
                color: item.color || "default", // Default color
              }
            : null
        })
        .filter(Boolean) // Remove invalid entries

      if (validCartItems.length > 0) {
        await db.cartItem.createMany({
          data: validCartItems as any[],
        })
      }
    }
  }

  return { userId: blitzContext.session.userId, ...user, email }
}
