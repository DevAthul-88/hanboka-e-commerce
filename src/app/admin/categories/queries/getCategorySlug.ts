import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetCategory = z.object({
  // This accepts type of undefined, but is required at runtime
  slug: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCategory), async ({ slug }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const category = await db.category.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isActive: true,
      sortOrder: true,
      parent: true,
    },
  })

  if (!category) throw new NotFoundError()

  return category
})
