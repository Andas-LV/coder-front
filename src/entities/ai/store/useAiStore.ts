import { create } from "zustand";
import axios from "axios";
import { streamMessageToAi } from "@/entities/ai/service/ai.service";
import { getErrorMessage, isAbortError } from "@/shared/api/errors";
import type { AiRequest, IIndexingItem, SendResult } from "../types";
import { generateCUID } from "@/shared/utils/generateCUID";
import {
	assistantMeta,
	toMessage,
	toSources,
	useChatsStore,
	type IndexingItemDto,
} from "@/entities/chats";
import { getUploadErrorMessage } from "../lib/pdf";

interface AiState {
	/** модель открытого чата (null — модель бэкенда по умолчанию) */
	model: string | null;
	setModel: (model: string | null) => void;

	/** идёт генерация ответа */
	loading: boolean;
	/** запрос отправлен, но первый токен ещё не пришёл — показываем TypingIndicator */
	waitingFirstToken: boolean;
	/** прогресс обработки приложенных PDF (до начала ответа), иначе null */
	indexing: IIndexingItem[] | null;

	sendReqToAi: (payload: AiRequest) => Promise<SendResult>;
	/** прервать текущую генерацию (частичный ответ остаётся) */
	stop: () => void;

	error: string | null;
	clearError: () => void;
}

const toIndexingItem = (i: IndexingItemDto): IIndexingItem => ({
	documentId: i.document_id,
	filename: i.filename,
	status: i.status,
	error: i.error,
	chunksDone: i.chunks_done,
	chunksTotal: i.chunks_total,
});

/** Ошибка HTTP до начала стрима (400/413/415/422/404): сервер ничего не сохранил. */
const isRejected = (err: unknown) => axios.isAxiosError(err) && !!err.response;

let controller: AbortController | null = null;

export const useAiStore = create<AiState>((set, get) => ({
	model: null,
	loading: false,
	waitingFirstToken: false,
	indexing: null,
	error: null,

	sendReqToAi: async ({ chatId, content, files = [] }) => {
		if (get().loading) return "rejected";

		const chats = () => useChatsStore.getState();
		const localId = generateCUID();
		let accumulated = "";
		let attached = false;

		controller = new AbortController();
		set({ loading: true, waitingFirstToken: true, indexing: null, error: null });

		chats().addRequest(chatId, {
			id: localId,
			createdAt: new Date().toISOString(),
			prompt: content,
			attachments: files.length
				? files.map((f) => ({ documentId: "", filename: f.name }))
				: null,
			response: "",
		});

		try {
			const dto = await streamMessageToAi(
				{ chatId, content, files },
				{
					signal: controller.signal,
					onIndexing: (items) => {
						const mapped = items.map(toIndexingItem);
						set({ indexing: mapped });
						if (!attached) {
							attached = true;
							chats().patchRequest(chatId, localId, {
								attachments: mapped.map(({ documentId, filename }) => ({ documentId, filename })),
							});
						}
					},
					onSources: (sources) => {
						set({ indexing: null });
						chats().patchRequest(chatId, localId, { sources: toSources(sources) });
					},
					onDelta: (text) => {
						if (get().waitingFirstToken) set({ waitingFirstToken: false, indexing: null });
						accumulated += text;
						chats().updateRequestResponse(chatId, localId, accumulated);
					},
				},
			);

			const message = toMessage(dto);
			chats().patchRequest(chatId, localId, {
				response: message.content || accumulated,
				...assistantMeta(message),
			});
			chats().touchChat(chatId, message.createdAt);
			return "ok";
		} catch (err) {
			if (isAbortError(err)) {
				chats().patchRequest(chatId, localId, {
					response: accumulated || "_Генерация остановлена_",
				});
				return "aborted";
			}

			if (isRejected(err)) {
				// убираем «висящий» вопрос — ChatInput вернёт текст и файлы в поле ввода
				chats().removeRequest(chatId, localId);
				set({ error: files.length ? getUploadErrorMessage(err) : getErrorMessage(err) });
				return "rejected";
			}

			const msg = getErrorMessage(err);
			chats().patchRequest(chatId, localId, {
				response: accumulated ? `${accumulated}\n\n**Ошибка:** ${msg}` : `**Ошибка:** ${msg}`,
				error: true,
			});
			set({ error: msg });
			return "failed";
		} finally {
			controller = null;
			set({ loading: false, waitingFirstToken: false, indexing: null });
		}
	},

	stop: () => controller?.abort(),

	setModel: (model) => set({ model }),
	clearError: () => set({ error: null }),
}));
