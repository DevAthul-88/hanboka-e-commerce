// mutations/setDefaultAddress.ts
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const SetDefaultAddressSchema = z.object({
  addressId: z.number(),
})

export default resolver.pipe(
  resolver.zod(SetDefaultAddressSchema),
  resolver.authorize(),
  async ({ addressId }, ctx) => {
    // First, unset any existing default address
    await db.address.updateMany({
      where: {
        userId: ctx.session.userId,
        isDefault: true,
      },
      data: { isDefault: false },
    })

    // Then set the new default address
    const address = await db.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    })

    return address
  }
)
