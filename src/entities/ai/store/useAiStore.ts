import { create } from "zustand";
import { streamMessageToAi } from "@/entities/ai/service/ai.service";
import { getErrorMessage, isAbortError } from "@/shared/api/errors";
import type { AiRequest } from "../types";
import { generateCUID } from "@/shared/utils/generateCUID";
import { assistantMeta, toMessage, useChatsStore } from "@/entities/chats";

interface AiState {
	/** модель открытого чата (null — модель бэкенда по умолчанию) */
	model: string | null;
	setModel: (model: string | null) => void;

	/** идёт генерация ответа */
	loading: boolean;
	/** запрос отправлен, но первый токен ещё не пришёл — показываем TypingIndicator */
	waitingFirstToken: boolean;

	sendReqToAi: (payload: AiRequest) => Promise<boolean>;
	/** прервать текущую генерацию (частичный ответ остаётся) */
	stop: () => void;

	error: string | null;
	clearError: () => void;
}

let controller: AbortController | null = null;

export const useAiStore = create<AiState>((set, get) => ({
	model: null,
	loading: false,
	waitingFirstToken: false,
	error: null,

	sendReqToAi: async ({ chatId, content }) => {
		if (get().loading) return false;

		const chats = useChatsStore.getState();
		const localId = generateCUID();
		let accumulated = "";

		controller = new AbortController();
		set({ loading: true, waitingFirstToken: true, error: null });

		chats.addRequest(chatId, {
			id: localId,
			createdAt: new Date().toISOString(),
			prompt: content,
			response: "",
		});

		try {
			const dto = await streamMessageToAi(
				{ chatId, content },
				{
					signal: controller.signal,
					onDelta: (text) => {
						if (get().waitingFirstToken) set({ waitingFirstToken: false });
						accumulated += text;
						useChatsStore.getState().updateRequestResponse(chatId, localId, accumulated);
					},
				},
			);

			const message = toMessage(dto);
			const store = useChatsStore.getState();
			store.patchRequest(chatId, localId, {
				response: message.content || accumulated,
				...assistantMeta(message),
			});
			store.touchChat(chatId, message.createdAt);
			return true;
		} catch (err) {
			const store = useChatsStore.getState();

			if (isAbortError(err)) {
				store.patchRequest(chatId, localId, {
					response: accumulated || "_Генерация остановлена_",
				});
				return false;
			}

			const msg = getErrorMessage(err);
			store.patchRequest(chatId, localId, {
				response: accumulated ? `${accumulated}\n\n**Ошибка:** ${msg}` : `**Ошибка:** ${msg}`,
				error: true,
			});
			set({ error: msg });
			return false;
		} finally {
			controller = null;
			set({ loading: false, waitingFirstToken: false });
		}
	},

	stop: () => controller?.abort(),

	setModel: (model) => set({ model }),
	clearError: () => set({ error: null }),
}));
