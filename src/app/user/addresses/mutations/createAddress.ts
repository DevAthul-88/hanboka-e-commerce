import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateAddressSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateAddressSchema),
  resolver.authorize(),
  async (input) => {
    console.log(input)

    // Ensure the userId is passed correctly
    const address = await db.address.create({
      data: {
        street: input.street,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        text: input.text ? input.text : "N/A",
        isDefault: input.isDefault,
        user: {
          connect: { id: input.userId }, // Use the userId from the session
        },
      },
    })

    return address
  }
)
