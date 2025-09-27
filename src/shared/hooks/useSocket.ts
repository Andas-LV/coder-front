import { useEffect, useState } from "react";
import { initSocket } from "@/core/config/socket";
import { Socket } from "socket.io-client";

export const useSocket = (token: string) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		if (!token) return;

		const newSocket = initSocket(token);
		setSocket(newSocket);

		newSocket.on("connect", () => setConnected(true));
		newSocket.on("disconnect", () => setConnected(false));

		return () => {
			newSocket.disconnect();
		};
	}, [token]);

	return { socket, connected };
};
