import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

// Types for dashboard data
export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  newCustomers: number
  activeUsers: number
  recentOrders: {
    id: string
    customer: string
    product: string
    total: string
    status: string
  }[]
  topProducts: {
    name: string
    sales: number
    revenue: string
  }[]
}

// Validation schema
const GetDashboardMetrics = z.object({
  timeframe: z.enum(["day", "week", "month"]).optional().default("month"),
})

export default resolver.pipe(resolver.zod(GetDashboardMetrics), async ({ timeframe }) => {
  // Get the date range based on timeframe
  const startDate = new Date()
  if (timeframe === "day") {
    startDate.setDate(startDate.getDate() - 1)
  } else if (timeframe === "week") {
    startDate.setDate(startDate.getDate() - 7)
  } else {
    startDate.setMonth(startDate.getMonth() - 1)
  }

  // Get total revenue and orders
  const orderMetrics = await db.order.aggregate({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    _sum: {
      totalAmount: true,
    },
    _count: {
      id: true,
    },
  })

  // Get new customers
  const newCustomers = await db.user.count({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
  })

  // Get active users (users with recent orders)
  const activeUsers = await db.user.count({
    where: {
      orders: {
        some: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    },
  })

  // Get recent orders
  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  // Get top products (fixed without `include`)
  const topProductsData = await db.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  })

  // Fetch product names separately
  const productIds = topProductsData.map((p) => p.productId)
  const productDetails = await db.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      name: true,
      price: true, // Assuming you store product prices
    },
  })

  // Merge product names with aggregated data
  const topProducts = topProductsData.map((item) => {
    const product = productDetails.find((p) => p.id === item.productId)
    return {
      name: product?.name || "Unknown Product",
      sales: item._sum.quantity || 0,
      revenue: `$${((product?.price || 0) * (item._sum.quantity || 0)).toFixed(2)}`,
    }
  })

  // Format the data
  const dashboardData: DashboardMetrics = {
    totalRevenue: orderMetrics._sum.totalAmount || 0,
    totalOrders: orderMetrics._count.id || 0,
    newCustomers,
    activeUsers,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      customer: order.user?.name || order.user?.email || "Unknown",
      product: order.items[0]?.product?.name || "Multiple Items",
      total: `$${order.totalAmount.toFixed(2)}`,
      status: order.status,
    })),
    topProducts,
  }

  return dashboardData
})
