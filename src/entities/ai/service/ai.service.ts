import axiosInstance from "@/shared/api/axiosInstance";
import { rethrowStreamError } from "@/shared/api/errors";
import { parseSSE } from "@/shared/lib/sse";
import type { MessageOutDto } from "@/entities/chats";
import type { AiRequest, StreamHandlers } from "@/entities/ai/types";

/** Без файлов — JSON, с файлами — multipart (content + files[]). */
function toBody({ content, files }: AiRequest) {
	if (!files?.length) return { body: { content }, headers: {} };

	const form = new FormData();
	form.append("content", content);
	files.forEach((f) => form.append("files", f));
	// сбрасываем дефолтный application/json — браузер сам поставит multipart с boundary
	return { body: form, headers: { "Content-Type": undefined } };
}

/**
 * POST /chats/{id}/messages/stream — ответ ассистента потоком.
 * Порядок событий: indexing* (только с файлами) → sources (чаты с документами)
 * → delta* → done. При сбое — error.
 */
export async function streamMessageToAi(
	request: AiRequest,
	{ onIndexing, onSources, onDelta, signal }: StreamHandlers,
): Promise<MessageOutDto> {
	const { body, headers } = toBody(request);

	const { data: stream } = await axiosInstance
		.post<ReadableStream<Uint8Array>>(`/chats/${request.chatId}/messages/stream`, body, {
			adapter: "fetch", // XHR-адаптер по умолчанию не отдаёт поток в браузере
			responseType: "stream",
			headers: { Accept: "text/event-stream", ...headers },
			signal,
		})
		.catch(rethrowStreamError);

	for await (const { event, data } of parseSSE(stream)) {
		if (event === "indexing") onIndexing?.(JSON.parse(data));
		if (event === "sources") onSources?.(JSON.parse(data));
		if (event === "delta") onDelta(data);
		if (event === "done") return JSON.parse(data);
		if (event === "error") throw new Error(data || "Ошибка генерации");
	}

	throw new Error("Поток завершился без события done");
}
