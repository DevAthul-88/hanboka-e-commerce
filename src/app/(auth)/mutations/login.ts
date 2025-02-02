import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { Role } from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async (input, ctx) => {
  const { email, password, cartItems = [] } = input
  const user = await authenticateUser(email, password)

  // Create session
  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  // Sync cart items
  const productSlugs = cartItems.map((item) => item.productSlug).filter(Boolean) // Ensure no null values

  const products = await db.product.findMany({
    where: { slug: { in: productSlugs } },
    select: { id: true, slug: true },
  })

  const productMap = new Map(products.map((p) => [p.slug, p.id]))

  // Remove existing cart items for the user
  await db.cartItem.deleteMany({ where: { userId: user.id } })

  // Insert new cart items
  const validCartItems = cartItems
    .map((item) => {
      const productId = productMap.get(item.productSlug)
      return productId
        ? {
            userId: user.id,
            productId,
            productSlug: item.productSlug, // Ensure productSlug is included
            size: item.size || "M", // Default to "M" if size is missing
            color: item.color || "default", // Default color
            quantity: item.quantity || 1, // Default quantity to 1 if missing
          }
        : null
    })
    .filter(Boolean) // Remove null values

  if (validCartItems.length > 0) {
    await db.cartItem.createMany({
      data: validCartItems as any[],
    })
  }

  return user
})
