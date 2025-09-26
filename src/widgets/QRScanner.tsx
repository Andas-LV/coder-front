"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { X, Camera, Upload } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { toast } from "sonner"

interface QRScannerProps {
	isOpen: boolean
	onClose: () => void
	onTokenExtracted: (token: string) => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onTokenExtracted }) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isScanning, setIsScanning] = useState(false)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)

	useEffect(() => {
		if (isOpen && !stream) {
			startCamera()
			setIsScanning(true)
		}

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop())
				setStream(null)
			}
		}
	}, [isOpen])

	useEffect(() => {
		let scanInterval: NodeJS.Timeout

		if (isScanning && !isProcessing) {
			scanInterval = setInterval(() => {
				captureAndAnalyzeFrame()
			}, 500)
		}

		return () => {
			if (scanInterval) {
				clearInterval(scanInterval)
			}
		}
	}, [isScanning, isProcessing])

	const startCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment",
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			})

			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream
				setStream(mediaStream)
			}
		} catch (error) {
			console.error("Ошибка доступа к камере:", error)
			toast.error("Не удалось получить доступ к камере")
		}
	}

	const extractTokenFromQR = (qrData: string): string | null => {
		try {
			// Попробуем разные форматы токенов

			// Если это URL с параметром token
			const urlMatch = qrData.match(/[?&]token=([^&]+)/)
			if (urlMatch) {
				return urlMatch[1]!
			}

			// Если это JSON с полем token
			try {
				const parsed = JSON.parse(qrData)
				if (parsed.token) {
					return parsed.token
				}
			} catch {}

			// Если это просто строка токена (JWT формат)
			if (qrData.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
				return qrData
			}

			// Если это строка, начинающаяся с "token:"
			if (qrData.startsWith("token:")) {
				return qrData.substring(6)
			}

			// Возвращаем как есть, если не удалось определить формат
			return qrData
		} catch (error) {
			console.error("Ошибка извлечения токена:", error)
			return null
		}
	}

	const captureAndAnalyzeFrame = () => {
		if (!videoRef.current || !canvasRef.current || isProcessing) return

		const canvas = canvasRef.current
		const video = videoRef.current
		const context = canvas.getContext("2d")

		if (!context) return

		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		context.drawImage(video, 0, 0)

		// Для демонстрации используем mock данные
		const mockQRData = `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}`

		// Симулируем случайное обнаружение QR-кода
		if (Math.random() > 0.7) {
			handleQRDetected(mockQRData)
		}
	}

	const handleQRDetected = async (qrData: string) => {
		setIsProcessing(true)
		setIsScanning(false)

		const token = extractTokenFromQR(qrData)

		if (token) {
			console.log("[v0] Извлеченный токен:", token)
			toast.success("QR-код обнаружен! Извлекаем токен...")

			onTokenExtracted(token)

			// Закрываем сканер после успешного извлечения
			setTimeout(() => {
				handleClose()
			}, 1000)
		} else {
			toast.error("Не удалось извлечь токен из QR-кода")
			setIsProcessing(false)
			setIsScanning(true)
		}
	}

	const handleClose = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop())
			setStream(null)
		}
		setIsScanning(false)
		setIsProcessing(false)
		onClose()
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				const result = e.target?.result as string
				// Здесь должна быть логика распознавания QR из изображения
				const mockQRData = `token:sample_token_from_image_${Date.now()}`
				handleQRDetected(mockQRData)
			}
			reader.readAsDataURL(file)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle className="text-lg font-semibold">Сканер токенов</CardTitle>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
						<X className="h-4 w-4" />
					</Button>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
						<video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
						<canvas ref={canvasRef} className="hidden" />

						{(isScanning || isProcessing) && (
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
								<div className="text-white text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
									<p>{isProcessing ? "Извлекаем токен..." : "Поиск QR-кода..."}</p>
								</div>
							</div>
						)}

						<div className="absolute inset-4 border-2 border-white/50 rounded-lg">
							<div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
							<div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
							<div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
							<div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
						</div>

						<div className="absolute bottom-4 left-4 right-4 text-center">
							<p className="text-white text-sm bg-black/50 rounded px-2 py-1">Наведите камеру на QR-код с токеном</p>
						</div>
					</div>

					<div className="flex gap-2">
						<Button
							onClick={() => setIsScanning(!isScanning)}
							disabled={isProcessing}
							variant={isScanning ? "destructive" : "default"}
							className="flex-1"
						>
							<Camera className="w-4 h-4 mr-2" />
							{isScanning ? "Остановить" : "Начать сканирование"}
						</Button>

						<label className="flex-1">
							<Button variant="outline" className="w-full bg-transparent" disabled={isProcessing} asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить
                </span>
							</Button>
							<input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
						</label>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
