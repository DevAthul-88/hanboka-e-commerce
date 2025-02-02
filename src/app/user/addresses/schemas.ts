import { z } from "zod"

export const CreateAddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  text: z.string().optional(),
  userId: z.number().optional(),
  isDefault: z.boolean().default(false),
})
export const UpdateAddressSchema = CreateAddressSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteAddressSchema = z.object({
  id: z.number(),
})
