'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/api';  // ← NEW

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get('token') || '';

  const [pass, setPass] = useState('');
  const [msg, setMsg]   = useState('');

  const strongPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!strongPwd.test(pass)) {
      alert(
        '❌ Password must be at least 8 characters and include:\n' +
        '• an uppercase letter\n' +
        '• a lowercase letter\n' +
        '• a number\n' +
        '• a special character'
      );
      setMsg('❌ Your new password does not meet the security requirements.');
      return;
    }

    try {
      const { message } = await resetPassword(token, pass);
      setMsg(message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>
      {msg && <p className="text-sm">{msg}</p>}
      <input
        type="password"
        placeholder="New password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        Reset Password
      </button>
    </form>
  );
}
