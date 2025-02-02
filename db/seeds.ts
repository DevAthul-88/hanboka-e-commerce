import db from "./index"
import { SecurePassword } from "@blitzjs/auth/secure-password"

async function seed() {
  try {
    // Admin user seeding (previous code remains the same)
    const existingUser = await db.user.findUnique({
      where: { email: "admin@gmail.com" },
    })
    if (!existingUser) {
      const hashedPassword = await SecurePassword.hash("1234567890")
      const user = await db.user.create({
        data: {
          email: "admin@gmail.com",
          hashedPassword,
          role: "ADMIN",
          name: "Admin User",
        },
      })
      console.log("Admin user created successfully:", user)
    } else {
      console.log("Admin user already exists. Skipping user creation.")
    }

    // Sizes seeding (existing code)
    const sizes = ["S", "M", "L", "XL", "XXL"]
    for (const size of sizes) {
      const existingSize = await db.size.findUnique({
        where: { name: size },
      })
      if (!existingSize) {
        await db.size.create({
          data: { name: size },
        })
        console.log(`Size ${size} seeded successfully!`)
      } else {
        console.log(`Size ${size} already exists. Skipping.`)
      }
    }

    // Colors seeding (new code)
    const colors = [
      { name: "Black", nameKorean: "검정", hexCode: "#000000" },
      { name: "White", nameKorean: "흰색", hexCode: "#FFFFFF" },
      { name: "Red", nameKorean: "빨강", hexCode: "#FF0000" },
      { name: "Blue", nameKorean: "파랑", hexCode: "#0000FF" },
      { name: "Green", nameKorean: "초록", hexCode: "#008000" },
      { name: "Yellow", nameKorean: "노랑", hexCode: "#FFFF00" },
      { name: "Navy", nameKorean: "네이비", hexCode: "#000080" },
      { name: "Gray", nameKorean: "회색", hexCode: "#808080" },
      { name: "Pink", nameKorean: "분홍", hexCode: "#FFC0CB" },
      { name: "Purple", nameKorean: "보라", hexCode: "#800080" },
      { name: "Brown", nameKorean: "갈색", hexCode: "#A52A2A" },
      { name: "Beige", nameKorean: "베이지", hexCode: "#F5F5DC" },
    ]

    for (const color of colors) {
      const existingColor = await db.color.findUnique({
        where: { name: color.name },
      })
      if (!existingColor) {
        await db.color.create({
          data: color,
        })
        console.log(`Color ${color.name} seeded successfully!`)
      } else {
        console.log(`Color ${color.name} already exists. Skipping.`)
      }
    }

    // Categories seeding with updated structure
    const mainCategories = [
      {
        name: "Men",
        nameKorean: "남성",
        slug: "men",
        description: "Men's fashion collection",
        imageUrl: "/images/categories/men.jpg",
        sortOrder: 1,
        subcategories: [
          {
            name: "Printed Men Shirts",
            nameKorean: "프린트 남성 셔츠",
            slug: "printed-men-shirts",
            description: "Stylish printed shirts for men",
            imageUrl: "/images/categories/printed-men-shirts.jpg",
            sortOrder: 1,
          },
        ],
      },
      {
        name: "Party Collection",
        nameKorean: "파티 컬렉션",
        slug: "party-collection",
        description: "Exclusive party wear collection",
        imageUrl: "/images/categories/party-collection.jpg",
        sortOrder: 2,
      },
      {
        name: "New Arrivals",
        nameKorean: "신상품",
        slug: "new-arrivals",
        description: "Latest fashion arrivals",
        imageUrl: "/images/categories/new-arrivals.jpg",
        sortOrder: 3,
      },
      {
        name: "Tops",
        nameKorean: "상의",
        slug: "tops",
        description: "Fashion tops collection",
        imageUrl: "/images/categories/tops.jpg",
        sortOrder: 4,
        subcategories: [
          {
            name: "Formal Blouses",
            nameKorean: "정장 블라우스",
            slug: "formal-blouses",
            description: "Professional formal blouses",
            imageUrl: "/images/categories/formal-blouses.jpg",
            sortOrder: 1,
          },
          {
            name: "Mesh Tops",
            nameKorean: "메쉬 탑",
            slug: "mesh-tops",
            description: "Trendy mesh tops",
            imageUrl: "/images/categories/mesh-tops.jpg",
            sortOrder: 2,
          },
          {
            name: "Black Tops",
            nameKorean: "블랙 탑",
            slug: "black-tops",
            description: "Classic black tops collection",
            imageUrl: "/images/categories/black-tops.jpg",
            sortOrder: 3,
          },
          {
            name: "Bodysuit",
            nameKorean: "바디수트",
            slug: "bodysuit",
            description: "Fashionable bodysuits",
            imageUrl: "/images/categories/bodysuit.jpg",
            sortOrder: 4,
          },
        ],
      },
      {
        name: "Shirts",
        nameKorean: "셔츠",
        slug: "shirts",
        description: "Comprehensive shirts collection",
        imageUrl: "/images/categories/shirts.jpg",
        sortOrder: 5,
      },
    ]

    // Create main categories and their subcategories
    for (const category of mainCategories) {
      const { subcategories, ...mainCategoryData } = category

      // Check if main category exists
      const existingMainCategory = await db.category.findUnique({
        where: { name: mainCategoryData.name },
      })

      let mainCategoryId
      if (!existingMainCategory) {
        // Create main category
        const createdMainCategory = await db.category.create({
          data: mainCategoryData,
        })
        console.log(`Main category ${mainCategoryData.name} seeded successfully!`)
        mainCategoryId = createdMainCategory.id
      } else {
        console.log(`Main category ${mainCategoryData.name} already exists. Skipping.`)
        mainCategoryId = existingMainCategory.id
      }

      // Create subcategories if they exist
      if (subcategories) {
        for (const subcategory of subcategories) {
          const existingSubcategory = await db.category.findUnique({
            where: { name: subcategory.name },
          })

          if (!existingSubcategory) {
            await db.category.create({
              data: {
                ...subcategory,
                parentId: mainCategoryId,
              },
            })
            console.log(`Subcategory ${subcategory.name} seeded successfully!`)
          } else {
            console.log(`Subcategory ${subcategory.name} already exists. Skipping.`)
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in database seeding:", error)
  }
  process.exit(0)
}

export default seed
