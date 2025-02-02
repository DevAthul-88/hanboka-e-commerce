import { Metadata } from "next"
import { invoke } from "src/app/blitz-server"
import MainLayout from "../../Layout/MainLayout"
import CategoryProducts from "../../components/Category/CategoryProducts"
import getCategorySlug from "../../admin/categories/queries/getCategorySlug"

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const data = await invoke(getCategorySlug, { slug: params.cat })
  return {
    title: `${data?.name}`,
  }
}

type CategoryPageProps = {
  params: { cat: string }
}

function page({ params }: CategoryPageProps) {
  return (
    <MainLayout>
      <CategoryProducts slug={params?.cat} />
    </MainLayout>
  )
}

export default page
