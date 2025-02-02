import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { AuthenticationError } from "blitz"
import { SecurePassword } from "@blitzjs/auth/secure-password"

// Validation schema
export const DeleteAccountSchema = z.object({
  id: z.number().min(1, "User ID is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmText: z
    .string()
    .refine(
      (val) => val === "delete my account",
      "Please type 'delete my account' exactly to confirm"
    ),
})

export default resolver.pipe(
  resolver.zod(DeleteAccountSchema),
  resolver.authorize(),
  async ({ username, password, id }) => {
    console.log("Received ID:", id)

    // Find user and verify credentials
    const user = await db.user.findFirst({
      where: {
        id, // Use the provided ID directly
        name: username, // Exact match to avoid unnecessary queries
      },
      select: {
        id: true, // Make sure to include the user ID
        hashedPassword: true,
      },
    })

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    // Verify password
    const result = await SecurePassword.verify(user.hashedPassword, password)
    if (result !== SecurePassword.VALID && result !== SecurePassword.VALID_NEEDS_REHASH) {
      throw new AuthenticationError("Incorrect password")
    }

    // Delete user and related data in a transaction
    try {
      await db.$transaction([
        db.session.deleteMany({ where: { userId: user.id } }),
        db.token.deleteMany({ where: { userId: user.id } }),
        db.order.deleteMany({ where: { userId: user.id } }),
        db.cartItem.deleteMany({ where: { userId: user.id } }),
        db.user.delete({ where: { id: user.id } }), // Delete the user
      ])

      return {
        success: true,
        message: "Account successfully deleted",
        userId: user.id,
      }
    } catch (error) {
      console.error("Delete account transaction failed:", error)
      throw new Error("Failed to delete account. Please try again.")
    }
  }
)
