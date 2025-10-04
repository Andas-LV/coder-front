"use client";
import type React from "react";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useQrStore } from "@/entities/qr";
import { useQrCamera } from "../hooks/useQrCamera";
import { useState, useRef } from "react";

interface QrScannerProps {
	onClose: () => void;
}

export const QrScanner = ({ onClose }: QrScannerProps) => {
	const { data: session } = useSession();
	const { approveQr } = useQrStore();

	const [isProcessing, setIsProcessing] = useState(false);
	const lastScanned = useRef<string | null>(null);

	const handleApprove = async (token: string) => {
		const userId = session?.user?.id || "";

		if (lastScanned.current === token || isProcessing) return;
		lastScanned.current = token;
		setIsProcessing(true);

		try {
			await approveQr({ userId, token });
			toast.success("QR успешно подтверждён");
			onClose();
		} catch (err) {
			toast.error("Ошибка при подтверждении QR");
			console.error(err);
		} finally {
			setIsProcessing(false);
		}
	};

	const { videoRef, canvasRef, hasPermission } = useQrCamera(handleApprove);

	return (
		<div className="fixed inset-0 bg-black z-50 flex flex-col">
			<video
				ref={videoRef}
				className="absolute inset-0 w-full h-full object-cover"
				playsInline
				muted
			/>
			<canvas ref={canvasRef} className="hidden" />

			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="absolute inset-0 bg-black/40" />
				<div className="w-64 h-64 border-2 border-white rounded-lg shadow-lg z-10" />
			</div>

			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-black z-10 transition-colors"
			>
				<X className="w-6 h-6" />
			</button>

			{hasPermission === false && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-center p-8 z-10">
					<div>
						<p className="text-xl font-semibold mb-2">
							Доступ к камере запрещён
						</p>
						<p className="text-sm text-gray-300">
							Разрешите доступ в настройках браузера
						</p>
					</div>
				</div>
			)}

			{isProcessing && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold z-10">
					<div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg">
						Обработка...
					</div>
				</div>
			)}
		</div>
	);
};
