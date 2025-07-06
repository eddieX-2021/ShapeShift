"use client"

import { useState } from "react"
import { loginUser } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SlSocialGoogle } from 'react-icons/sl'
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  try {
    await loginUser(email, password)
    toast({
      title: "Login successful ✅",
      description: "Redirecting to your dashboard...",
    })
    window.location.href = "/";
  } catch (err: any) {
    toast({
      title: "Login failed ❌",
      description: err.response?.data?.error || "Something went wrong",
      variant: "destructive",
    })
  }finally {
      setIsLoading(false)
    }
}
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your ShapeShift account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}/>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
              <div className="text-center text-sm mt-2">
              <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                  onClick={() => router.push('/')}
                >
                  Home
                </button>
            </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
