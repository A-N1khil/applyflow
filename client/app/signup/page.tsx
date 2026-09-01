"use client"

import { useState } from "react"
import { SignupForm } from "@/components/signup-form-entry"
import { SignupDetailedForm } from "@/components/signup-form-detailed"

export default function SignupPage() {
  const [step, setStep] = useState(1)

  function handleSignup(email: string) {
    console.log(email)
    setStep(2)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      {step === 1 ? (
        <div className="w-full max-w-sm">
          <SignupForm onSignup={handleSignup} />
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <SignupDetailedForm />
        </div>
      )}
    </div>
  )
}
