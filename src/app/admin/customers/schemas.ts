import { z } from "zod"

export const CreateUserSchema = z.object({
  email: z.string(),
  name: z.string(),
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateUserSchema = CreateUserSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteUserSchema = z.object({
  id: z.number(),
})
