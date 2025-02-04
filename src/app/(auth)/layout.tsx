import { useAuthenticatedBlitzContext } from "../blitz-server"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
