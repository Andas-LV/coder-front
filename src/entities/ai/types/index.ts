import type { IndexingItemDto, SourceDto } from "@/entities/chats";

export interface AiRequest {
	chatId: string;
	content: string;
	/** 0–5 PDF до 20 МБ; если есть — уходит multipart, иначе JSON */
	files?: File[];
}

export interface StreamHandlers {
	/** только при файлах в сообщении: прогресс индексации, каждые ~2 с */
	onIndexing?: (items: IndexingItemDto[]) => void;
	/** только для чатов с документами: приходит до первого delta */
	onSources?: (sources: SourceDto[]) => void;
	onDelta: (text: string) => void;
	signal?: AbortSignal;
}

/** Прогресс обработки приложенного файла (camelCase). */
export interface IIndexingItem {
	documentId: string;
	filename: string;
	status: "processing" | "ready" | "failed";
	error: string | null;
	chunksDone: number;
	chunksTotal: number;
}

export type SendResult =
	/** ответ получен */
	| "ok"
	/** пользователь нажал «стоп» */
	| "aborted"
	/** сервер отклонил запрос до начала стрима (413/415/422/400) — ничего не сохранено */
	| "rejected"
	/** ошибка во время стрима (индексация или модель) */
	| "failed";
