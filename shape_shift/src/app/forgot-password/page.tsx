'use client'
import { useState, FormEvent } from 'react'
import axios from 'axios'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { withCredentials: true }
      )
      setMsg(res.data.message)
    } catch (err:any) {
      setMsg(err.response?.data?.error || 'Error sending email')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Forgot Password</h1>
      {msg && <p className="text-sm">{msg}</p>}
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        Send Reset Link
      </button>
    </form>
  )
}
