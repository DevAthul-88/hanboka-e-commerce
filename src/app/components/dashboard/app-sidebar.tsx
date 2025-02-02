"use client"

import * as React from "react"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavUser } from "@/components/dashboard/nav-user"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { invoke } from "@blitzjs/rpc"
import Logo from "../../assets/logo.png"
import Image from "next/image"

import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Palette,
  Users,
  ShoppingCart,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Products",
      url: "#",
      icon: ShoppingBag,
      isActive: false,
      items: [
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "Add Product",
          url: "/admin/products/new",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      icon: FolderTree,
      isActive: false,
      items: [
        {
          title: "All Categories",
          url: "/admin/categories",
        },
        {
          title: "Add Category",
          url: "/admin/categories/new",
        },
      ],
    },
    {
      title: "Colors",
      url: "#",
      icon: Palette,
      isActive: false,
      items: [
        {
          title: "All Colors",
          url: "/admin/colors",
        },
        {
          title: "Add Color",
          url: "/admin/colors/new",
        },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
      isActive: false,
      items: [],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
      isActive: false,
      items: [],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentUser: null
}

export function AppSidebar({ currentUser, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="ml-2">
          <Image src={Logo.src} width={100} height={140} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
