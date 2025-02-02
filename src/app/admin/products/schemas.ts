import { z } from "zod"

export const CreateProductSchema = z.object({
  // Product Name
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(100, { message: "Name must not exceed 100 characters." }),

  // Slug
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long." })
    .max(100, { message: "Slug must not exceed 100 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be URL-friendly (lowercase letters, numbers, and hyphens).",
    }),

  // SKU
  sku: z
    .string()
    .min(1, { message: "SKU is required." })
    .max(50, { message: "SKU must not exceed 50 characters." }),

  // Description
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(5000, { message: "Description must not exceed 5000 characters." })
    .optional(),

  price: z
    .union([z.number(), z.string().transform((val) => parseFloat(val))])
    .refine((val) => val !== null && val !== undefined, { message: "Price is required" })
    .refine((val) => !isNaN(val) && val >= 0.01, { message: "Price must be at least $0.01." })
    .refine((val) => val <= 99999, { message: "Price must not exceed $99,999." }),

  salePrice: z
    .union([z.number(), z.string().transform((val) => parseFloat(val))])
    .refine((val) => !isNaN(val) && val >= 0, { message: "Sale price must be at least $0." })
    .refine((val) => val <= 99999, { message: "Sale price must not exceed $99,999." })
    .optional(),

  // Stock
  stock: z
    .union([z.number(), z.string().transform((val) => parseInt(val, 10))])
    .refine((val) => !isNaN(val) && val >= 0, { message: "Inventory quantity cannot be negative." })
    .refine((val) => val <= 10000, { message: "Stock quantity must not exceed 10,000." }),

  // Featured Product
  isFeatured: z.boolean(),

  // Product Category
  categoryId: z.coerce
    .number({
      required_error: "Please select a valid category.",
      invalid_type_error: "Category selection is invalid.",
    })
    .optional(),

  colorId: z.coerce
    .number({
      required_error: "Please select a valid color.",
      invalid_type_error: "Color selection is invalid.",
    })
    .optional(),

  sizeIds: z
    .array(z.number().positive("Invalid size ID"))
    .min(1, "At least one size must be selected"),

  // Product Gender Category
  gender: z
    .string()
    .min(1, { message: "Gender category is required." })
    .max(20, { message: "Gender category must not exceed 20 characters." })
    .optional(),

  // Product Style
  style: z
    .string()
    .max(100, { message: "Product style must not exceed 100 characters." })
    .optional(),

  // Weight
  weight: z
    .union([z.number(), z.string().transform((val) => parseFloat(val))])
    .refine((val) => !isNaN(val) && val >= 0.01, { message: "Weight must be at least 0.01." })
    .refine((val) => val <= 1000, { message: "Weight must not exceed 1000." })
    .optional(),

  // Dimensions (L x W x H)
  dimensions: z
    .string()
    .max(100, { message: "Product dimensions must not exceed 100 characters." })
    .optional(),

  // Primary Material
  material: z
    .string()
    .min(1, { message: "Primary material is required." })
    .max(100, { message: "Material must not exceed 100 characters." }),

  // Care Instructions
  careInstructions: z
    .string()
    .max(200, { message: "Care instructions must not exceed 200 characters." })
    .optional(),

  // Product Tags
  tags: z.string().max(100, { message: "Tags must not exceed 100 characters." }).optional(),
})

export const UpdateProductSchema = CreateProductSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteProductSchema = z.object({
  id: z.number(),
})
