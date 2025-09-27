import { io, Socket } from "socket.io-client";

export const initSocket = (token: string): Socket => {
	const socket = io(process.env.NEXT_BACKEND_URL!, {
		withCredentials: true,
		transports: ["websocket"],
		reconnection: true,
		reconnectionAttempts: 10,
		reconnectionDelay: 1000,
	});

	socket.on("connect", () => {
		console.log("Connected to server:", socket.id);
		socket.emit("register", { token });
	});

	return socket;
};
