"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useQrStore } from "@/features/qr";
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

		// защита от повторного вызова
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
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
			<div className="bg-white rounded-2xl p-4 relative w-full max-w-sm h-[28rem] flex flex-col">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
				>
					<X />
				</button>
				<h2 className="text-lg font-bold text-center mb-3">Сканируй QR</h2>

				<div className="flex-1 rounded-xl overflow-hidden border relative">
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
						className="w-full h-full"
					/>
					{isProcessing && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold">
							Обработка...
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
