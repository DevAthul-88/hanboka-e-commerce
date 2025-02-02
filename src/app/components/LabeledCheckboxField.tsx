// LabeledCheckboxField.tsx
import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"

export interface LabeledCheckboxFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledCheckboxField = forwardRef<HTMLInputElement, LabeledCheckboxFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [field] = useField(name)
    const { isSubmitting, setFieldValue } = useFormikContext()

    return (
      <div {...outerProps}>
        <Label htmlFor={name}>{label}</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Checkbox
            id={name}
            checked={field.value}
            disabled={isSubmitting}
            onCheckedChange={(checked) => setFieldValue(name, checked)}
            {...props}
            ref={ref}
          />
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

LabeledCheckboxField.displayName = "LabeledCheckboxField"
