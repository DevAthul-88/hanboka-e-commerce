import { forwardRef, PropsWithoutRef } from "react"
import { useFormikContext, ErrorMessage } from "formik"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"

export interface LabeledCheckboxGroupProps extends PropsWithoutRef<JSX.IntrinsicElements["div"]> {
  name: string
  label: string
  options: { label: string; value: number }[]
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledCheckboxGroup = forwardRef<HTMLDivElement, LabeledCheckboxGroupProps>(
  ({ name, label, options, outerProps, ...props }, ref) => {
    const { setFieldValue, values } = useFormikContext<{ [key: string]: number[] }>()

    const handleCheckedChange = (value: number, checked: boolean) => {
      const currentValues = (values[name] as number[]) || []
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value)

      setFieldValue(name, newValues)
    }

    return (
      <div {...outerProps} ref={ref}>
        <Label className="block text-sm font-medium text-gray-700 mb-2">{label}</Label>
        <div className="grid grid-cols-5 gap-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${name}-${option.value}`}
                checked={(values[name] as number[])?.includes(option.value) || false}
                onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
                {...props}
              />
              <Label htmlFor={`${name}-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" className="text-sm font-medium text-destructive mt-1">
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

LabeledCheckboxGroup.displayName = "LabeledCheckboxGroup"
