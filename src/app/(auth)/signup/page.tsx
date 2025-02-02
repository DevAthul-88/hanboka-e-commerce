import { Metadata } from "next"
import { SignupForm } from "../components/SignupForm"

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup page",
}

export default function SignUpPage() {
  return <SignupForm />
}
