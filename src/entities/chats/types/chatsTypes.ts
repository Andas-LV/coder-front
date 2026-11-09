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

export interface SourceDto {
	n: number;
	document_id: string;
	filename: string;
	page: number;
	score: number;
}

export interface AttachmentDto {
	document_id: string;
	filename: string;
	pages: number;
}

/** Событие `indexing` стрима: по элементу на каждый приложенный файл. */
export interface IndexingItemDto {
	document_id: string;
	filename: string;
	status: "processing" | "ready" | "failed";
	error: string | null;
	chunks_done: number;
	chunks_total: number;
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
	/** null — чат без документов; [] — документы есть, но ничего не нашлось */
	sources?: SourceDto[] | null;
	/** PDF, приложенные к сообщению пользователя; иначе null */
	attachments?: AttachmentDto[] | null;
}

/** GET /chats/{id}/files/{document_id} — временная ссылка на оригинал в R2. */
export interface ChatFileUrlDto {
	url: string;
	filename: string;
	/** секунды */
	expires_in: number;
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

/** Источник ответа: `n` — номер, который стоит в тексте как [n]. */
export interface ISource {
	n: number;
	documentId: string;
	filename: string;
	page: number;
	score: number;
}

export interface IAttachment {
	documentId: string;
	filename: string;
	/** неизвестно, пока сервер не сохранил сообщение */
	pages?: number;
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
	sources: ISource[] | null;
	attachments: IAttachment[] | null;
}

/** Пара «вопрос пользователя + ответ ассистента» — то, что рисует MessageBubble. */
export interface IRequest {
	id: string;
	createdAt: string;
	prompt: string;
	/** файлы, приложенные к вопросу */
	attachments?: IAttachment[] | null;
	response: string;
	/** id сообщения ассистента на сервере (после сохранения) */
	responseId?: string;
	model?: string | null;
	inputTokens?: number | null;
	outputTokens?: number | null;
	latencyMs?: number | null;
	costUsd?: string | null;
	/** null/undefined — без документов, [] — ничего не найдено */
	sources?: ISource[] | null;
	/** ответ завершился ошибкой */
	error?: boolean;
}

export interface IChatFileUrl {
	/** presigned-ссылка, авторизация не нужна */
	url: string;
	filename: string;
	/** ms timestamp */
	expiresAt: number;
}

export interface IChatById extends IChatsList {
	requests: IRequest[];
}
