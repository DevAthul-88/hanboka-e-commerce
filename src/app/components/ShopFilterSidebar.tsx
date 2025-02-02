import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ShopFilterSidebarProps {
  categories: Array<{ id: number; name: string }>
  colors: Array<{ id: number; name: string; hex: string }>
  products: Array<{ id: number; name: string }>
  selectedCategories: number[]
  selectedColors: number[]
  selectedSizes: number[]
  onCategoryChange: (ids: number[]) => void
  onColorChange: (ids: number[]) => void
  onSizeChange: (ids: number[]) => void
}

const ShopFilterSidebar: React.FC<ShopFilterSidebarProps> = ({
  categories,
  colors,
  products,
  selectedCategories,
  selectedColors,
  selectedSizes,
  onCategoryChange,
  onColorChange,
  onSizeChange,
}) => {
  const handleCategoryToggle = (categoryId: number, checked: boolean) => {
    if (checked) {
      onCategoryChange([...selectedCategories, categoryId])
    } else {
      onCategoryChange(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleColorToggle = (colorId: number, checked: boolean) => {
    if (checked) {
      onColorChange([...selectedColors, colorId])
    } else {
      onColorChange(selectedColors.filter((id) => id !== colorId))
    }
  }

  const handleSizeToggle = (sizeId: number, checked: boolean) => {
    if (checked) {
      onSizeChange([...selectedSizes, sizeId])
    } else {
      onSizeChange(selectedSizes.filter((id) => id !== sizeId))
    }
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <Accordion
        type="multiple"
        defaultValue={["categories", "colors", "sizes"]}
        className="space-y-6"
      >
        {/* Categories Filter */}
        <AccordionItem value="categories" className="border-b-0">
          <AccordionTrigger className="text-lg font-semibold uppercase">
            Product Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
                  </Label>
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(category.id, checked as boolean)
                    }
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors Filter */}
        <AccordionItem value="colors" className="border-b-0">
          <AccordionTrigger className="text-lg font-semibold uppercase">Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3">
              {colors?.map((color) => (
                <div key={color.id} className="flex flex-col items-center space-y-1 mt-2 ml-2">
                  <button
                    className={`w-8 h-8 rounded-full border cursor-pointer transition-all ${
                      selectedColors.includes(color.id)
                        ? "ring-2 ring-black ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                    }`}
                    style={{ backgroundColor: color.hexCode }}
                    onClick={() => handleColorToggle(color.id, !selectedColors.includes(color.id))}
                    aria-label={`Filter by ${color.name}`}
                  />
                  <span className="text-xs">{color.name}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes Filter */}
        <AccordionItem value="sizes" className="border-b-0">
          <AccordionTrigger className="text-lg font-semibold uppercase">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {products?.map((size) => (
                <button
                  key={size.id}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    selectedSizes.includes(size.id) ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSizeToggle(size.id, !selectedSizes.includes(size.id))}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Clear Filters */}
        {(selectedCategories.length > 0 ||
          selectedColors.length > 0 ||
          selectedSizes.length > 0) && (
          <button
            className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            onClick={() => {
              onCategoryChange([])
              onColorChange([])
              onSizeChange([])
            }}
          >
            Clear All Filters
          </button>
        )}
      </Accordion>
    </div>
  )
}

export default ShopFilterSidebar
