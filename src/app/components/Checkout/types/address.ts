export interface Address {
  id: number
  fullName: string
  streetAddress: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}
