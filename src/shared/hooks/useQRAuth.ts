"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { QRAuthData } from "@/features/qr";

export function useQRAuth() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleQRLogin = async (userData: QRAuthData) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch("/api/auth/qr-signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || "Authentication failed")
			}

			const signInResult = await signIn("qr-login", {
				redirect: false,
				userData: JSON.stringify(userData),
			})

			if (signInResult?.error) {
				throw new Error("Failed to create session")
			}

			router.push("/dashboard")
			return { success: true }
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error"
			setError(errorMessage)
			return { success: false, error: errorMessage }
		} finally {
			setIsLoading(false)
		}
	}

	return {
		handleQRLogin,
		isLoading,
		error,
	}
}
