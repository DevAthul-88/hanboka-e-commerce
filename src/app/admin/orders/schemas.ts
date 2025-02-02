import { z } from "zod"

export const CreateOrderSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateOrderSchema = CreateOrderSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteOrderSchema = z.object({
  id: z.number(),
})
