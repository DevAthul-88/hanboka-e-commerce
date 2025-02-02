import { Metadata } from "next"
import { LoginForm } from "../components/LoginForm"

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
}

export default function LoginPage() {
  return <LoginForm />
}
