import React, { useEffect } from "react";
import { useQrStore } from "@/features/qr";
import QRCode from "react-qr-code";
import { useSocket } from "@/shared/hooks/useSocket";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ShowQr = () => {
	const { getQr, createdQr, loading } = useQrStore();

	useEffect(() => {
		getQr();
	}, [getQr]);

	const { socket, connected } = useSocket(createdQr?.token || "");

	useEffect(() => {
		if (!socket) return;

		socket.on("message", (msg: any) => {
			console.log("Получено сообщение:", msg);
		});

		return () => {
			socket?.off("message");
		};
	}, [socket]);

	if (loading) return <Skeleton className="w-64 h-64 rounded-2xl" />;
	if (!createdQr) return <Skeleton className="w-64 h-64 rounded-2xl" />;

	return (
		<div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-4">
			<QRCode value={createdQr.token} size={256} />
		</div>
	);
};
