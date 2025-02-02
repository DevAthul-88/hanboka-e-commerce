import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { Input } from "./ui/input"
import { Label as Labl } from "./ui/label"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <Labl>{label}</Labl>
          <Input {...input} disabled={isSubmitting} {...props} ref={ref} />
        </div>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" className="text-sm font-medium text-destructive">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
