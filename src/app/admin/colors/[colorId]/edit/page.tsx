import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getColor from "../../queries/getColor"
import { EditColor } from "../../components/EditColor"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

type EditColorPageProps = {
  params: { colorId: string }
}

export async function generateMetadata({ params }: EditColorPageProps): Promise<Metadata> {
  const Color = await invoke(getColor, { id: Number(params.colorId) })
  return {
    title: `Edit Color - ${Color.name}`,
  }
}

export default async function Page({ params }: EditColorPageProps) {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <EditColor colorId={Number(params.colorId)} />
      </Suspense>
    </AdminLayout>
  )
}
