"use client"

import { useState } from "react"
import { Check, MapPin, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Address } from "./Checkout/types/address"
import Link from "next/link"

interface AddressFormProps {
  savedAddresses: Address[]
  onAddressSelect: (address: Address | null) => void
  onAddNewAddress: (address: Address) => void
}

export function AddressForm({
  savedAddresses,
  onAddressSelect,
  onAddNewAddress,
}: AddressFormProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({})
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    savedAddresses.find((addr) => addr.isDefault)?.id || null
  )

  const handleNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidAddress(newAddress)) {
      onAddNewAddress(newAddress as Address)
      setShowNewAddressForm(false)
    }
  }

  const isValidAddress = (address: Partial<Address>): boolean => {
    const requiredFields = ["fullName", "streetAddress", "city", "state", "zipCode", "country"]
    return requiredFields.every((field) => address[field as keyof Address])
  }

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId)
    const selectedAddress = savedAddresses.find((addr) => addr.id === addressId)
    onAddressSelect(selectedAddress || null)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {savedAddresses.map((address) => (
          <Card
            key={address.id}
            className={`cursor-pointer transition-all ${
              selectedAddressId === address.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Checkbox
                  id={`address-${address.id}`}
                  checked={selectedAddressId === address.id}
                  onCheckedChange={() => handleAddressSelect(address.id)}
                />
                <Label htmlFor={`address-${address.id}`} className="flex-grow ml-2 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {address.isDefault && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        <Check className="mr-1 h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {address.street}, {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                    {address.text && (
                      <p className="text-sm text-muted-foreground">{address.text}</p>
                    )}
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="cursor-pointer hover:bg-muted/50 transition-all">
          <Link href={"/user/addresses/new"}>
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <Plus className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Add new address</span>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
