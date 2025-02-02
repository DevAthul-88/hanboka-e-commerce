"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import signup from "../mutations/signup"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import MainLayout from "../../Layout/MainLayout"
import Link from "next/link"
import { Field, Formik } from "formik"
import { validateZodSchema } from "blitz"
import * as z from "zod"
import { Form as FormikForm, FormikProps } from "formik"

export const SignupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const router = useRouter()

  return (
    <MainLayout>
      <div className="mb-4 pb-4" />

      <section className="login-register container">
        <h2 className="text-center">Signup</h2>
        <div className="tab-content pt-2">
          <div className="tab-pane fade show active">
            <div className="login-form">
              <Formik
                initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
                validate={validateZodSchema(SignupSchema)}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    // Retrieve cart items from localStorage before signup
                    const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]")

                    // Pass cart items with signup mutation
                    await signupMutation({
                      ...values,
                      cartItems, // Include cart items
                    })

                    // Clear localStorage cart after successful signup
                    localStorage.removeItem("cart_items")

                    // Refresh router and navigate
                    router.refresh()
                    router.push("/")
                  } catch (error: any) {
                    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                      setErrors({ email: "This email is already in use" })
                    } else {
                      setErrors({ [FORM_ERROR]: error.toString() })
                    }
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <FormikForm className="form">
                    <div className="form-floating mb-3">
                      <Field
                        name="name"
                        type="text"
                        className={`form-control form-control_gray ${
                          touched.name && errors.name ? "is-invalid" : ""
                        }`}
                        id="customerNameInput"
                        placeholder="Full Name *"
                      />
                      <label htmlFor="customerNameInput">Full Name *</label>
                      {touched.name && errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        name="email"
                        type="email"
                        className={`form-control form-control_gray ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        id="customerEmailInput"
                        placeholder="Email address *"
                      />
                      <label htmlFor="customerEmailInput">Email address *</label>
                      {touched.email && errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        name="password"
                        type="password"
                        className={`form-control form-control_gray ${
                          touched.password && errors.password ? "is-invalid" : ""
                        }`}
                        id="customerPasswordInput"
                        placeholder="Password *"
                      />
                      <label htmlFor="customerPasswordInput">Password *</label>
                      {touched.password && errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        name="confirmPassword"
                        type="password"
                        className={`form-control form-control_gray ${
                          touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="customerConfirmPasswordInput"
                        placeholder="Confirm Password *"
                      />
                      <label htmlFor="customerConfirmPasswordInput">Confirm Password *</label>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>

                    {errors[FORM_ERROR] && (
                      <div className="alert alert-danger mb-3" role="alert">
                        {errors[FORM_ERROR]}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100 text-uppercase"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>

                    <div className="customer-option mt-4 text-center">
                      <span className="text-secondary">Already have an account?</span>
                      <Link href="/login" className="btn-text ms-2">
                        Log In
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
