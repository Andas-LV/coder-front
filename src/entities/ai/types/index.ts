export interface AiRequest {
	chatId: string;
	content: string;
}

export interface StreamHandlers {
	onDelta: (text: string) => void;
	signal?: AbortSignal;
}
