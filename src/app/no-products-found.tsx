import { PackageSearch } from "lucide-react"

interface NoProductsFoundProps {
  message?: string
}

export function NoProductsFound({ message = "No products found" }: NoProductsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] p-4 text-center">
      <PackageSearch className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">{message}</h2>
      <p className="text-gray-500 max-w-md">
        We couldn't find any products matching your criteria. Try adjusting your search or filters.
      </p>
    </div>
  )
}
