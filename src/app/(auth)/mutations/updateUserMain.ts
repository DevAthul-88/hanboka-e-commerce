import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { AuthenticationError } from "blitz"

// Define a Zod schema for user profile updates
const ProfileUpdate = z
  .object({
    id: z.number(),
    currentPassword: z.string().min(1, "Current password is required"),
    name: z.string().min(2).max(100).optional().default(undefined),
    email: z.string().email("Invalid email address").optional().default(undefined),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .optional()
      .default(undefined),
  })
  .strict()

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, currentPassword, newPassword, ...data }, ctx) => {
    try {
      // Ensure user can only update their own profile
      if (id !== ctx.session.userId) {
        throw new AuthenticationError("You can only update your own profile")
      }

      // Find user and validate existence
      const user = await db.user.findFirst({
        where: { id },
        select: { id: true, hashedPassword: true },
      })
      if (!user) {
        throw new AuthenticationError("User not found")
      }

      // Validate current password using SecurePassword
      const passwordValidation = await SecurePassword.verify(user.hashedPassword, currentPassword)
      if (passwordValidation !== SecurePassword.VALID) {
        throw new AuthenticationError("Current password is incorrect")
      }

      // Prepare update data, excluding null/undefined fields
      const updateData: any = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      )

      // If new password is provided, hash it
      if (newPassword) {
        updateData.hashedPassword = await SecurePassword.hash(newPassword)
      }

      // Perform update
      const updatedUser = await db.user.update({
        where: { id },
        data: updateData,
        select: { id: true, name: true, email: true },
      })

      return updatedUser
    } catch (error) {
      console.error("Update user error:", error)
      throw error
    }
  }
)
