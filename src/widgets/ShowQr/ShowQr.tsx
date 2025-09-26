import React, { useEffect } from "react";
import { useQrStore } from "@/features/qr";
import QRCode from "react-qr-code";
import { listenForLogin } from "@/core/config/ws"

export const ShowQr = () => {
	const { getQr, createdQr, loading } = useQrStore();

	useEffect(() => {
		getQr();
	}, [getQr]);

	if (loading) return <p>Загрузка...</p>;
	if (!createdQr) return <p>QR не найден</p>;

	listenForLogin(createdQr.token);

	return (
		<div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-4">
			<QRCode value={createdQr.token} size={256} />
		</div>
	);
};
