"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signupRegistry } from '@/lib/services/auth.service'

export default function SignupPage() {
    const router = useRouter()
    const [userId, setUserId]               = useState('')
    const [password, setPassword]           = useState('')
    const [confirmPassword, setConfirmPass] = useState('')
    const [loading, setLoading]             = useState(false)
    const [error, setError]                 = useState<string | null>(null)
    const [success, setSuccess]             = useState(false)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            setLoading(false)
            return
        }

        const result = await signupRegistry(
            userId.trim(),
            password.trim(),
            confirmPassword.trim()
        )

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        setSuccess(true)
        setTimeout(() => {
            router.push('/quiz')
            router.refresh()
        }, 800)
    }

    const matchError = confirmPassword.length > 0 && password !== confirmPassword

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f3ee] p-4 font-serif">
            <div className="bg-white rounded-[16px] border border-[#e8e3da] p-10 px-8 w-full max-w-[400px] flex flex-col">
                <h1 className="text-[24px] font-semibold text-[#1a1714] m-0 mb-1 text-center tracking-tight">
                    Create Account
                </h1>
                <p className="text-[14px] text-[#7a7268] text-center m-0 mb-8">
                    Quick signup — just pick an ID and password
                </p>

                {success ? (
                    <div className="flex flex-col items-center gap-3 py-6 animate-[fadeUp_0.4s_ease-out]">
                        <div className="w-14 h-14 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[28px]">
                            ✓
                        </div>
                        <p className="text-[16px] font-medium text-[#2e7d32] m-0">Account created!</p>
                        <p className="text-[13px] text-[#7a7268] m-0">Redirecting…</p>
                    </div>
                ) : (
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#3d3830]">Your ID</label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="e.g. STU-2024-042"
                                required
                                autoComplete="username"
                                className="p-2.5 px-3.5 rounded-lg border border-[#ddd8cf] text-[15px] text-[#1a1714] bg-[#fafaf8] outline-none transition-colors focus:border-gray-400 font-sans"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#3d3830]">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Choose a password"
                                required
                                autoComplete="new-password"
                                className="p-2.5 px-3.5 rounded-lg border border-[#ddd8cf] text-[15px] text-[#1a1714] bg-[#fafaf8] outline-none transition-colors focus:border-gray-400 font-sans"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#3d3830]">Re-enter Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                autoComplete="new-password"
                                className={`p-2.5 px-3.5 rounded-lg border text-[15px] text-[#1a1714] bg-[#fafaf8] outline-none transition-colors focus:border-gray-400 font-sans ${
                                    matchError ? 'border-[#e74c3c] bg-[#fef7f6]' : 'border-[#ddd8cf]'
                                }`}
                            />
                            {matchError && (
                                <span className="text-[12px] text-[#e74c3c] mt-0.5">Passwords don&apos;t match</span>
                            )}
                        </div>

                        {error && (
                            <p className="text-[13px] text-[#c0392b] bg-[#fdf0ee] border border-[#f5c6c0] rounded-lg p-2.5 px-3 m-0">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#2c2620] text-white border-none rounded-lg p-2.5 text-[15px] font-medium cursor-pointer mt-1 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center relative hover:opacity-90 min-h-[44px]"
                        >
                            {loading
                                ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-[spin_1s_linear_infinite] absolute" />
                                : 'Create Account →'
                            }
                        </button>

                        <p className="text-[13px] text-[#7a7268] text-center m-0 mt-2">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-[#2c2620] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity">
                                Sign in
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}
