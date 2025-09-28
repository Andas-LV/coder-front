"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useQrStore } from "@/entities/qr";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const QrReader = dynamic(
	() => import("react-qr-reader").then((mod) => mod.QrReader),
	{ ssr: false },
);

interface QrScannerProps {
	onClose: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onClose }) => {
	const { data: session } = useSession();
	const { approveQr } = useQrStore();

	const [isProcessing, setIsProcessing] = useState(false);
	const lastScanned = useRef<string | null>(null);

	const handleApprove = async (token: string) => {
		if (!session?.user?.id) return;
		if (lastScanned.current === token || isProcessing) return;

		lastScanned.current = token;
		setIsProcessing(true);

		try {
			await approveQr({ userId: session.user.id, token });
			toast.success("QR успешно подтверждён");
			onClose();
		} catch (err) {
			toast.error("Ошибка при подтверждении QR");
			console.error(err);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black z-50 flex flex-col">
			<QrReader
				constraints={{ facingMode: "environment" }}
				onResult={(result, error) => {
					if (result) {
						const token = result.getText();
						handleApprove(token);
					}
					if (error) {
						console.warn("QR Error:", error.message);
					}
				}}
				className="w-full h-full object-cover"
			/>

			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-64 h-64 border-4 border-white rounded-lg" />
			</div>

			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-black"
			>
				<X />
			</button>

			{isProcessing && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold">
					Обработка...
				</div>
			)}
		</div>
	);
};
