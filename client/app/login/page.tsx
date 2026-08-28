"use client"

import { LoginForm } from "@/components/login-form"
import { Form } from "lucide-react"

export default function LoginPage() {
  function handleLogin(email: string) {
    console.log(email)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Form className="size-6" />
            </div>
            <span className="sr-only">ApplyFlow</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to ApplyFlow</h1>
        </div>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  )
}
