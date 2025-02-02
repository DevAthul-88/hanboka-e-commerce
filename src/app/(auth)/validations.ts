import { z } from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const Signup = z.object({
  name: z.string(),
  email,
  password,
})

export const Login = z.object({
  email: z.string().email(),
  password: z.string(),
  cartItems: z
    .array(
      z.object({
        productSlug: z.string(),
        quantity: z.number(),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .optional(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
