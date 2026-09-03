"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toaster, toast } from "@/components/ui/toast"
import { useUser } from "@/contexts/user-context"
import type { User, UserLoginRequest } from "@/models/user"
import { userService } from "@/services/user-service"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

// TODO: Remove the temporary login bypass and this hard-coded user.
const LOGIN_BYPASS_ENABLED = true
const LOGIN_BYPASS_USER: User = {
  id: "07706578-a19d-47bb-b39f-f525ba22eb56",
  email: "ethan.hunt@example.com",
  first_name: "Ethan",
  last_name: "Hunt",
  created_at: "2026-09-01T10:25:30.906695",
}

type LoginFormValues = z.infer<typeof loginSchema>
type LoginFormProps = React.ComponentProps<"div">

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter()
  const { setUser } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function submitLogin(values: LoginFormValues) {
    const userLogin: UserLoginRequest = values
    const loginPromise = userService.login(userLogin)

    try {
      toast.promise(loginPromise, {
        loading: {
          title: "Logging in..",
          type: "loading",
          timeout: 0,
        },
        success: {
          title: "Login successful",
          type: "success",
          timeout: 5000,
        },
        error: (error: unknown) => ({
          title: "Unable to log in",
          description:
            error instanceof Error ? error.message : "Please try again",
          type: "error",
          timeout: 5000,
          priority: "high",
        }),
      })

      const user = await loginPromise
      setUser(user)
      router.push("/dashboard")
    } catch {
      // The promise toast displays the server or network error.
    }
  }

  function submitLoginForm(event: React.FormEvent<HTMLFormElement>) {
    if (LOGIN_BYPASS_ENABLED) {
      // TODO: Remove this branch to restore server-side credential validation.
      event.preventDefault()
      setUser(LOGIN_BYPASS_USER)
      router.push("/dashboard")
      return
    }

    void handleSubmit(submitLogin)(event)
  }

  // TODO: Restore `!isValid || isSubmitting` directly when removing the bypass.
  const isLoginDisabled = LOGIN_BYPASS_ENABLED
    ? false
    : !isValid || isSubmitting

  return (
    <Toaster>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Login with your Apple or Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitLoginForm} noValidate>
              <FieldGroup>
                <Field>
                  <Button variant="outline" type="button" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Apple
                  </Button>
                  <Button variant="outline" type="button" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <Field data-invalid={Boolean(errors.email)}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                  <FieldError errors={[errors.email]} />
                </Field>
                <Field data-invalid={Boolean(errors.password)}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                  />
                  <FieldError errors={[errors.password]} />
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoginDisabled}>
                    Login
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </Toaster>
  )
}
