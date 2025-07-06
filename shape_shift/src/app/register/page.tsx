"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password }, {
        withCredentials: true
      })
      setMessage("✅ " + res.data.msg)
      setTimeout(() => router.push("/login"), 1000)
    } catch (err: any) {
      setMessage("❌ " + (err.response?.data?.error || "Registration failed"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Create an account</h1>
          {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Register</Button>
            <div className="text-center text-sm">
              Already have an account? <a href="/login" className="underline">Login</a>
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
          </form>
          
        </CardContent>
      </Card>
    </div>
  )
}
