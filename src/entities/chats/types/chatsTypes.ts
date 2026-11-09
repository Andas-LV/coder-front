/* ---------- Контракты FastAPI (snake_case, как приходит с сервера) ---------- */

export type MessageRole = "user" | "assistant" | "system";

export interface ChatOutDto {
	id: string;
	title: string;
	system_prompt: string | null;
	model: string | null;
	created_at: string;
	updated_at: string;
}

export interface MessageOutDto {
	id: string;
	role: MessageRole;
	content: string;
	model: string | null;
	input_tokens: number | null;
	output_tokens: number | null;
	latency_ms: number | null;
	/** Decimal приходит строкой */
	cost_usd: string | null;
	created_at: string;
}

export interface ChatDetailDto extends ChatOutDto {
	messages: MessageOutDto[];
}

/* ---------- Модели фронта (camelCase) ---------- */

export interface ICreateChat {
	model?: string;
	title?: string;
	systemPrompt?: string;
}

export interface IUpdateChat {
	title?: string;
	systemPrompt?: string | null;
	model?: string | null;
}

export interface IChatsList {
	id: string;
	title: string;
	model: string | null;
	systemPrompt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface IMessage {
	id: string;
	role: MessageRole;
	content: string;
	model: string | null;
	inputTokens: number | null;
	outputTokens: number | null;
	latencyMs: number | null;
	costUsd: string | null;
	createdAt: string;
}

/** Пара «вопрос пользователя + ответ ассистента» — то, что рисует MessageBubble. */
export interface IRequest {
	id: string;
	createdAt: string;
	prompt: string;
	response: string;
	/** id сообщения ассистента на сервере (после сохранения) */
	responseId?: string;
	model?: string | null;
	inputTokens?: number | null;
	outputTokens?: number | null;
	latencyMs?: number | null;
	costUsd?: string | null;
	/** ответ завершился ошибкой */
	error?: boolean;
}

export interface IChatById extends IChatsList {
	requests: IRequest[];
}
