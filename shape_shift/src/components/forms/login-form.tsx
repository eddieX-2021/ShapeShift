"use client"

import { useState } from "react"
import { loginUser } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'

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
      const { message } = await loginUser(email, password)
      // Store token for subsequent API calls
       toast.success(message)
      router.push('/')
    } catch (err: unknown) {
    const msg =
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message: string }).message
        : 'Login failed';
    toast.error(msg, { position: 'top-right' });
  } finally {
      setIsLoading(false)
    }
  }

  return (
     <>
      <ToastContainer />
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
                  placeholder="a@example.com"
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
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
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
  <Image
    src="/images.jpg"
    alt="Image"
    fill
    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
  />
</div>

        </CardContent>
      </Card>

       <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{' '}
        <Dialog>
          <DialogTrigger asChild>
            <a className="cursor-pointer underline underline-offset-4">Terms of Service & Privacy Policy</a>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Terms of Service & Privacy Policy</DialogTitle>
            </DialogHeader>
            <DialogDescription asChild>
              <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-4 text-sm">
                <p><strong>1. Acceptance of Terms.</strong> By accessing or using ShapeShift, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                <p><strong>2. Description of Service.</strong> ShapeShift provides personalized fitness and diet planning tools, including intake forms, progress tracking, AI-generated workout and meal plans, and related features.</p>
                <p><strong>3. User Accounts.</strong> You must register for an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
                <p><strong>4. Prohibited Conduct.</strong> You agree not to misuse the Service, including by engaging in unlawful activities, violating intellectual property rights, or attempting to compromise security features.</p>
                <p><strong>5. Intellectual Property.</strong> All content provided through ShapeShift, including text, graphics, and software, is the property of ShapeShift or its licensors.</p>
                <p><strong>6. Termination.</strong> We may suspend or terminate your account for violations of these Terms without prior notice.</p>
                <p><strong>7. Disclaimers.</strong> The Service is provided “as is” without warranties of any kind. We do not guarantee the accuracy or reliability of AI-generated recommendations.</p>
                <p><strong>8. Limitation of Liability.</strong> In no event will ShapeShift be liable for indirect, incidental, or consequential damages arising from your use of the Service.</p>
                <p><strong>9. Governing Law.</strong> These Terms are governed by the laws of the State of New York, without regard to its conflict of law provisions.</p>
                <p><strong>10. Changes to Terms.</strong> We may modify these Terms at any time. Continued use of the Service constitutes acceptance of any changes.</p>
                <p><strong>11. Contact Information.</strong> For questions about these Terms, please contact <a href="mailto:eddiexiao2019@gmail.com" className="underline">eddiexiao2019@gmail.com</a>.</p>

                <h3 className="text-base font-semibold">Privacy Policy</h3>
                <p><strong>12. Information We Collect.</strong> We collect personal data such as name, email, weight, BMI, fitness goals, workout history, and food logs.</p>
                <p><strong>13. Use of Data.</strong> We use your information to operate, maintain, and improve the Service, personalize content, and communicate with you about your account.</p>
                <p><strong>14. Data Sharing and Disclosure.</strong> We do not sell your personal data. We may share data with service providers under confidentiality agreements.</p>
                <p><strong>15. Data Security.</strong> We implement reasonable security measures to protect your data, but cannot guarantee absolute security.</p>
                <p><strong>16. Cookies and Tracking Technologies.</strong> We use cookies to enhance your experience and track usage patterns. You may disable cookies in your browser settings.</p>
                <p><strong>17. Your Rights.</strong> You may access, update, or delete your personal information by contacting us at our support email.</p>
                <p><strong>18. Changes to this Privacy Policy.</strong> We may update this policy; your continued use constitutes acceptance of changes.</p>
                <p><strong>19. Contact Information.</strong> For questions about this Privacy Policy, please contact <a href="mailto:eddiexiao2019@gmail.com" className="underline">eddiexiao2019@gmail.com</a>.</p>
              </div>
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
  )
}
