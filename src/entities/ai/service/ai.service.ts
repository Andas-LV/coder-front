import axiosInstance from "@/shared/api/axiosInstance";
import { rethrowStreamError } from "@/shared/api/errors";
import { parseSSE } from "@/shared/lib/sse";
import type { MessageOutDto } from "@/entities/chats";
import type { AiRequest, StreamHandlers } from "@/entities/ai/types";

/**
 * POST /chats/{id}/messages/stream — ответ ассистента потоком.
 * События: delta (кусок текста), done (сохранённое сообщение), error.
 */
export async function streamMessageToAi(
	{ chatId, content }: AiRequest,
	{ onDelta, signal }: StreamHandlers,
): Promise<MessageOutDto> {
	const { data: stream } = await axiosInstance
		.post<ReadableStream<Uint8Array>>(
			`/chats/${chatId}/messages/stream`,
			{ content },
			{
				adapter: "fetch", // XHR-адаптер по умолчанию не отдаёт поток в браузере
				responseType: "stream",
				headers: { Accept: "text/event-stream" },
				signal,
			},
		)
		.catch(rethrowStreamError);

	for await (const { event, data } of parseSSE(stream)) {
		if (event === "delta") onDelta(data);
		if (event === "done") return JSON.parse(data);
		if (event === "error") throw new Error(data || "Ошибка генерации");
	}

	throw new Error("Поток завершился без события done");
}
