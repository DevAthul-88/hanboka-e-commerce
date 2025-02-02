import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface Option {
  label: string
  value: string | number
}

export interface LabeledSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  name: string
  label: string
  options: Option[]
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  ({ name, label, options, outerProps, ...props }, ref) => {
    const [field] = useField(name)
    const { isSubmitting, setFieldValue } = useFormikContext()

    const handleValueChange = (value: string) => {
      setFieldValue(name, value)
    }

    return (
      <div {...outerProps}>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <Label>{label}</Label>
          <Select
            disabled={isSubmitting}
            onValueChange={handleValueChange}
            value={field.value ? String(field.value) : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            {options.length > 0 && (
              <SelectContent>
                {options
                  .filter((option) => option.value !== "") // Exclude empty values
                  .map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            )}
          </Select>
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

LabeledSelectField.displayName = "LabeledSelectField"
