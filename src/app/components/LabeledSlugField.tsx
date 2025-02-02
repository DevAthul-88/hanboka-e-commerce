import { forwardRef, PropsWithoutRef, useEffect } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

export interface LabeledSlugFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  placeholder?: string
  sourceField: string // Field to sync the slug from
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledSlugField = forwardRef<HTMLInputElement, LabeledSlugFieldProps>(
  ({ name, label, placeholder, sourceField, outerProps, ...props }, ref) => {
    const [field, , helpers] = useField(name)
    const { values, setFieldValue } = useFormikContext()

    // Sync the slug field when the source field changes
    useEffect(() => {
      const sourceValue = values[sourceField]
      if (sourceValue) {
        const slug = sourceValue
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
          .replace(/^-+|-+$/g, "") // Trim dashes from start and end
        setFieldValue(name, slug) // Set slug value
      } else {
        setFieldValue(name, "") // Clear slug if the source field is empty
      }
    }, [values[sourceField], setFieldValue, name]) // Depend on both sourceField and name

    return (
      <div {...outerProps}>
        <Label htmlFor={name}>{label}</Label>
        <Input
          {...field}
          {...props}
          ref={ref}
          id={name}
          placeholder={placeholder}
          autoComplete="off"
          disabled
          value={field.value || ""} // Ensure it always has a value (empty string if undefined)
        />
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

LabeledSlugField.displayName = "LabeledSlugField"
