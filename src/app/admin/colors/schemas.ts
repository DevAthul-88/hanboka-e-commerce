import { z } from "zod"

export const CreateColorSchema = z.object({
  name: z.string(),
  hexCode: z.string(),
})
export const UpdateColorSchema = CreateColorSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteColorSchema = z.object({
  id: z.number(),
})
