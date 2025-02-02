import { z } from "zod"

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  parentId: z
    .string()
    .nullable()
    .transform((val) => {
      if (val === null || val === "") return null
      return Number(val)
    })
    .pipe(
      z
        .number()
        .nullable()
        .refine((val) => val === null || val >= 1, {
          message: "Please choose a parent from the available options.",
        })
    ),
})

export const UpdateCategorySchema = CreateCategorySchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteCategorySchema = z.object({
  id: z.number(),
})
