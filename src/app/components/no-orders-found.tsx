import { PackageSearch } from "lucide-react"

interface NoProductsFoundProps {
  message?: string
}

export function NoOrdersFound({ message = "No orders found" }: NoProductsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center  p-4 text-center">
      <PackageSearch className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">{message}</h2>
      <p className="text-gray-500 max-w-md">
        It seems you haven't placed any orders yet. Browse our collection and start shopping!
      </p>
    </div>
  )
}
