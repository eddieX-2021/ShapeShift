"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { message } = await forgotPassword(email);
      toast.success("Reset link sent! Check your inbox.");
      setMsg(message);
    } catch (err: unknown) {
      // Extract message if AxiosError, else fallback
      const errMsg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : "Error sending email";
      setMsg(errMsg);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Send Reset Link
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </>
  );
}
