"use client"

import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, Field, Form as FormikForm, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { AuthenticationError } from "blitz"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import MainLayout from "../../Layout/MainLayout"
import { useMutation } from "@blitzjs/rpc"
import login from "../mutations/login"
import Link from "next/link"

// Schema Definition
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
})

type LoginFormType = z.infer<typeof LoginSchema>

// Form Props Interface
interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  children?: ReactNode
  submitText?: string
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>["initialValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

// Login Form Props
interface LoginFormProps {
  onSuccess?: (user: any) => void
  next?: string
}

export function LoginForm({ onSuccess, next }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const [loginMutation] = useMutation(login)

  const handleSubmit = async (values: LoginFormType) => {
    try {
      // Retrieve cart items from localStorage before login
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]")

      // Pass cart items with login mutation
      const user = await loginMutation({
        ...values,
        cartItems, // Add cart items to mutation
      })

      // Clear localStorage cart after successful login
      localStorage.removeItem("cart_items")

      // Refresh router and navigate
      router.refresh()

      if (next) {
        router.push("/login")
      } else {
        router.push("/")
      }

      // Call onSuccess callback if provided
      onSuccess?.(user)
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        return {
          FORM_ERROR: "Sorry, those credentials are invalid",
        }
      } else {
        return {
          FORM_ERROR: `Sorry, we had an unexpected error. Please try again. - ${error.toString()}`,
        }
      }
    }
  }

  return (
    <MainLayout>
      <div className="mb-4 pb-4" />
      <section className="login-register container">
        <h2 className="text-center">Login</h2>
        <div className="tab-content pt-2">
          <div className="tab-pane fade show active">
            <div className="login-form">
              <Formik
                initialValues={{ email: "", password: "", remember: false }}
                validate={validateZodSchema(LoginSchema)}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    const result = await handleSubmit(values)
                    if (result?.FORM_ERROR) {
                      setFormError(result.FORM_ERROR)
                    }
                    const { FORM_ERROR, ...otherErrors } = result || {}
                    if (Object.keys(otherErrors).length > 0) {
                      setErrors(otherErrors)
                    }
                  } catch (error) {
                    console.error("Submission error:", error)
                    setFormError("An error occurred. Please try again.")
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <FormikForm className="form">
                    <div className="form-floating mb-3">
                      <Field
                        name="email"
                        type="email"
                        className={`form-control form-control_gray ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        id="customerNameEmailInput1"
                        placeholder="Email address *"
                      />
                      <label htmlFor="customerNameEmailInput1">Email address *</label>
                      {touched.email && errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="pb-3"></div>

                    <div className="form-floating mb-3">
                      <Field
                        name="password"
                        type="password"
                        className={`form-control form-control_gray ${
                          touched.password && errors.password ? "is-invalid" : ""
                        }`}
                        id="customerPasswodInput"
                        placeholder="Password *"
                      />
                      <label htmlFor="customerPasswodInput">Password *</label>
                      {touched.password && errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="d-flex align-items-center mb-3 pb-2">
                      <div className="form-check mb-0">
                        <Field
                          name="remember"
                          type="checkbox"
                          className="form-check-input form-check-input_fill"
                          id="flexCheckDefault1"
                        />
                        <label
                          className="form-check-label text-secondary"
                          htmlFor="flexCheckDefault1"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    {formError && (
                      <div className="alert alert-danger mb-3" role="alert">
                        {formError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100 text-uppercase"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Loading...." : "Log In"}
                    </button>

                    <div className="customer-option mt-4 text-center">
                      <span className="text-secondary">No account yet?</span>
                      <Link href="/signup" className="btn-text ms-2">
                        Create Account
                      </Link>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .form > * + * {
          margin-top: 1rem;
        }
      `}</style>

      <div className="mb-5 pb-xl-5"></div>
    </MainLayout>
  )
}

export default LoginForm
