"use client"

import { useState } from "react"
import { SignupForm } from "@/components/signup-form-entry"
import { SignupDetailedForm } from "@/components/signup-form-detailed"
import { Form } from "lucide-react"

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [signupEmail, setSignupEmail] = useState("")

  function handleSignup(email: string) {
    setSignupEmail(email)
    setStep(2)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      {step === 2 && (
        <div className="flex flex-col items-center gap-2 text-center">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Form className="size-6" />
            </div>
            <span className="sr-only">ApplyFlow</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to ApplyFlow</h1>
        </div>
      )}
      {step === 1 ? (
        <div className="w-full max-w-sm">
          <SignupForm onSignup={handleSignup} />
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <SignupDetailedForm email={signupEmail} />
        </div>
      )}
    </div>
  )
}
