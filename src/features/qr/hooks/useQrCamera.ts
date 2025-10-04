import { useEffect, useRef, useState } from "react";

export const useQrCamera = (onScan: (data: string) => void) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		let mounted = true;

		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});

				if (!mounted) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}

				streamRef.current = stream;
				setHasPermission(true);

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.play();
				}

				startScanning();
			} catch (err) {
				console.error("Camera error:", err);
				setHasPermission(false);
			}
		};

		const startScanning = () => {
			scanIntervalRef.current = setInterval(() => {
				scanQRCode();
			}, 300);
		};

		const scanQRCode = async () => {
			if (!videoRef.current || !canvasRef.current) return;

			const video = videoRef.current;
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");

			if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

			try {
				const jsQR = (await import("jsqr")).default;
				const code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: "dontInvert",
				});

				if (code?.data) {
					onScan(code.data);
				}
			} catch (err) {
				console.error("QR scan error:", err);
			}
		};

		startCamera();

		return () => {
			mounted = false;
			if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
			if (streamRef.current)
				streamRef.current.getTracks().forEach((track) => track.stop());
		};
	}, [onScan]);

	return { videoRef, canvasRef, hasPermission };
};
