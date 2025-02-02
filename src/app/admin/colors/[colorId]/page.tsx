import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getColor from "../queries/getColor"
import { Color } from "../components/Color"
import { AdminLayout } from "@/src/app/Layout/AdminLayout"
import { Spinner } from "@/src/app/components/Loader"

export async function generateMetadata({ params }: ColorPageProps): Promise<Metadata> {
  const Color = await invoke(getColor, { id: Number(params.colorId) })
  return {
    title: `Color - ${Color.name}`,
  }
}

type ColorPageProps = {
  params: { colorId: string }
}

export default async function Page({ params }: ColorPageProps) {
  return (
    <AdminLayout>
      <p>
        <Link href={"/colors"}>Colors</Link>
      </p>
      <Suspense
        fallback={
          <div className="mt-16">
            <Spinner />
          </div>
        }
      >
        <Color colorId={Number(params.colorId)} />
      </Suspense>
    </AdminLayout>
  )
}
