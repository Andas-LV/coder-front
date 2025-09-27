"use client"

import { useEffect } from "react"
import { toast } from "sonner";
import { useQRAuth } from "@/shared/hooks/useQRAuth";

interface QRLoginHandlerProps {
	onLoginSuccess?: () => void
	onLoginError?: (error: string) => void
}

export function QRLoginHandler({ onLoginSuccess, onLoginError }: QRLoginHandlerProps) {
	const { handleQRLogin, isLoading, error } = useQRAuth()

	useEffect(() => {
		const handleQRLoginEvent = async (event: CustomEvent) => {
			const userData = event.detail

			if (userData && userData.type === "login") {
				const result = await handleQRLogin(userData)

				if (result.success) {
					toast.success("Успешный вход")
					onLoginSuccess?.()
				} else {
					toast.error("Ошибка входа")
					onLoginError?.(result.error || "Unknown error")
				}
			}
		}

		window.addEventListener("qr-login", handleQRLoginEvent as any)

		return () => {
			window.removeEventListener("qr-login", handleQRLoginEvent as any)
		}
	}, [handleQRLogin, onLoginSuccess, onLoginError, toast])

	if (isLoading) {
		return <div>Выполняется вход...</div>
	}

	if (error) {
		return <div>Ошибка: {error}</div>
	}

	return null
}
