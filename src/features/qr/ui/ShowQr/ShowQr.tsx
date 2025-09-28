import React, { useEffect } from "react";
import { QRAuthData, useQrStore } from "@/entities/qr";
import QRCode from "react-qr-code";
import { useSocket } from "@/shared/hooks/useSocket";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { routes } from "@/core/config/routes";
import { handleQrLogin } from "@/features/qr/utils/handleQrLogin";

export const ShowQr = () => {
	const { getQr, createdQr, loading } = useQrStore();
	const router = useRouter();

	useEffect(() => {
		getQr();
	}, [getQr]);

	const { socket } = useSocket(createdQr?.token || "");

	useEffect(() => {
		if (!socket) return;

		socket.on("message", async (msg: QRAuthData) => {
			await handleQrLogin(msg.user);
			router.push(routes.home());
		});

		return () => {
			socket?.off("message");
		};
	}, [socket, router]);

	if (loading) return <Skeleton className="w-64 h-64 rounded-2xl" />;
	if (!createdQr) return <Skeleton className="w-64 h-64 rounded-2xl" />;

	return (
		<div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-4">
			<QRCode value={createdQr.token} size={256} />
		</div>
	);
};
