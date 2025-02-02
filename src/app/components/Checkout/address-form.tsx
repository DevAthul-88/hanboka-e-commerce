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
import type { Address } from "../types/address"

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">{address.streetAddress}</p>
                    {address.apartment && (
                      <p className="text-sm text-muted-foreground">{address.apartment}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-all"
          onClick={() => setShowNewAddressForm(true)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <Plus className="w-6 h-6 mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Add new address</span>
          </CardContent>
        </Card>
      </div>

      <Collapsible open={showNewAddressForm}>
        <CollapsibleContent>
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleNewAddressSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                      id="streetAddress"
                      placeholder="123 Main St"
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, streetAddress: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      placeholder="Apt 4B"
                      onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        onValueChange={(value) => setNewAddress({ ...newAddress, state: value })}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          {/* Add more states */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      onValueChange={(value) => setNewAddress({ ...newAddress, country: value })}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        {/* Add more countries */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Save Address
                </Button>
              </form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
