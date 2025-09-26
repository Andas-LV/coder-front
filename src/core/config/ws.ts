export function listenForLogin(token: string) {
	const ws = new WebSocket("ws://localhost:8000"); // или wss://your-domain.co// 2. После установки соединения, регистрируем наш токен на сервере
	ws.onopen = () => {
		console.log("WebSocket connection established.");
		const payload = {
			type: "register",
			token: token,
		};
		ws.send(JSON.stringify(payload));
		console.log("Registered with token:", token);
	}; // 3. Слушаем входящие сообщения от сервера
	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		// 4. Сервер прислал подтверждение входа
		if (data.type === "login") {
			console.log("Login successful!", data.user);

			ws.close(); // Закрываем соединение
		}
	};

	ws.onclose = () => {
		console.log("WebSocket connection closed.");
	};

	ws.onerror = (error) => {
		console.error("WebSocket error:", error);
	};
}
