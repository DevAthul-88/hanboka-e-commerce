"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  items: any[]
}

export function MobileNav({ items }: MobileNavProps) {
  const topLevelCategories = items?.filter((cat) => !cat.parentId) || []

  // Function to get child categories for a parent
  const getChildCategories = (parentId) => {
    return items?.filter((cat) => cat.parentId === parentId) || []
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
      <div className="flex flex-col space-y-2 p-4">
        {topLevelCategories.map((item) => {
          const hasChildren = item.children && item.children.length > 0

          if (!hasChildren) {
            return (
              <Link
                key={item.id}
                href={`/categories/${item.slug}`}
                className="flex w-full items-center rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium hover:bg-gray-100"
              >
                {item.name}
              </Link>
            )
          }

          return (
            <Collapsible key={item.id}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium hover:bg-gray-100">
                {item.name}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4">
                {/* Featured Section - if you have featured items */}
                {item.featured && (
                  <div className="mb-4 mt-2 space-y-2">
                    {item.featured.map((feature) => (
                      <Link
                        key={feature.title}
                        href={feature.href}
                        className="block rounded-md bg-gray-50 p-3 hover:bg-gray-100"
                      >
                        <div className="text-sm font-medium">{feature.title}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Categories Section */}
                {item.children.map((category) => {
                  const subCategories = getChildCategories(category.id)
                  const hasSubs = subCategories.length > 0

                  if (!hasSubs) {
                    return (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="block py-2 text-sm text-gray-600 hover:text-primary"
                      >
                        {category.name}
                      </Link>
                    )
                  }

                  return (
                    <Collapsible key={category.id}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-600">
                        {category.name}
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-4 space-y-2 border-l border-gray-200 pl-4 pt-2">
                          {subCategories.map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={`/categories/${subItem.slug}`}
                              className="block py-1 text-sm text-gray-600 hover:text-primary"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </ScrollArea>
  )
}
