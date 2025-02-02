import React from "react"
import { Form, type FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledCheckboxField } from "@/src/app/components/LabeledCheckboxField"
export { FORM_ERROR } from "src/app/components/Form"

export function AddressForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <div>
      <Form<S> {...props}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
            <LabeledTextField
              name="street"
              label="Street Address"
              placeholder="Enter street address"
              type="text"
            />
          </div>

          <LabeledTextField name="city" label="City" placeholder="Enter city" type="text" />

          <LabeledTextField
            name="state"
            label="State/Province"
            placeholder="Enter state or province"
            type="text"
          />

          <LabeledTextField
            name="postalCode"
            label="Postal Code"
            placeholder="Enter postal code"
            type="text"
          />

          <LabeledTextField
            name="country"
            label="Country"
            placeholder="Enter country"
            type="text"
          />

          <LabeledTextField
            name="text"
            label="Additional Notes"
            placeholder="Enter any additional notes"
            type="text"
          />

          <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
            <LabeledCheckboxField name="isDefault" label="Set as Default Address" />
          </div>
        </div>
      </Form>
    </div>
  )
}
