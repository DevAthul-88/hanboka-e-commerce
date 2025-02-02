import { useMutation } from "@blitzjs/rpc"
import Form from "../Form"
import { toast } from "react-toastify"
import LabeledTextField from "../LabeledTextField"
import { useState } from "react"
import updateUserMain from "../../(auth)/mutations/updateUserMain"

export function UpdateUserForm({
  initialValues,
  onSuccess,
}: {
  initialValues: { id: number; name?: string; email?: string }
  onSuccess?: () => void
}) {
  const [updateUserMutation] = useMutation(updateUserMain)
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  return (
    <div>
      <Form
        submitText="Update Profile"
        initialValues={{
          ...initialValues,
          currentPassword: "",
          newPassword: "",
        }}
        onSubmit={async (values) => {
          try {
            await updateUserMutation(values)
            toast.success("Profile updated successfully!")
            onSuccess?.()
          } catch (error: any) {
            if (error.name === "AuthenticationError") {
              toast.error(error.message)
            } else {
              toast.error("Failed to update profile")
            }
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name and Email */}
          <LabeledTextField name="name" label="Name" placeholder="John Doe" />
          <LabeledTextField
            name="email"
            label="Email"
            placeholder="john@example.com"
            type="email"
          />

          {/* Always show current password field */}
          <LabeledTextField
            name="currentPassword"
            label="Current Password"
            placeholder="Required for any changes"
            type="password"
            required
          />

          {/* Password toggle button */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>

          {/* New password field (conditionally shown) */}
          {showPasswordFields && (
            <LabeledTextField
              name="newPassword"
              label="New Password"
              placeholder="Min 8 characters"
              type="password"
              required
            />
          )}
        </div>
      </Form>
    </div>
  )
}
