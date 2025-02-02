import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProduct = z.object({
  slug: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetProduct), async ({ slug }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const product = await db.product.findFirst({
    where: { slug: slug },
    include: {
      images: true,
      sizes: true,
      color: true,
      category: true,
      reviews: true,
      orderItems: true,
      cartItems: true,
      wishedBy: true,
      ProductSize: {
        include: {
          size: true,
        },
      },
    },
  })

  if (!product) throw new NotFoundError()

  return product
})
