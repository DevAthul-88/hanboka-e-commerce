import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikProps, Form as FormikForm } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
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

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={validateZodSchema(schema)}
      onSubmit={async (values, { setErrors }) => {
        try {
          const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}
          if (FORM_ERROR) {
            setFormError(FORM_ERROR)
          }

          if (Object.keys(otherErrors).length > 0) {
            setErrors(otherErrors)
          }
        } catch (error) {
          console.error("Submission error:", error)
          setFormError("An error occurred. Please try again.")
        }
      }}
    >
      {({ isSubmitting }) => (
        <main>
          <div className="mb-4 pb-4" />
          <section className="login-register container">
            <h2 className="d-none">Login &amp; Register</h2>
            <div className="tab-content pt-2" id="login_register_tab_content">
              <div className="tab-pane fade show active">
                <div className="login-form">
                  <FormikForm className="form" {...props}>
                    {/* Form fields supplied as children are rendered here */}
                    {children}

                    {formError && (
                      <div role="alert" style={{ color: "red" }}>
                        {formError}
                      </div>
                    )}

                    {submitText && (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="animate-spin" />} {submitText}
                      </Button>
                    )}

                    <style global jsx>{`
                      .form > * + * {
                        margin-top: 1rem;
                      }
                    `}</style>
                  </FormikForm>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </Formik>
  )
}

export default Form
