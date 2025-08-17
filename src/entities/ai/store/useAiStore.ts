import { create } from "zustand";
import { sendMessageToAi } from "@/entities/ai/service/ai.service";
import { AiRequest, AiResponse } from "../types";
import { AiTypes } from "@/shared/types/AiTypes";
import { generateCUID } from "@/shared/utils/generateCUID";
import { IRequest } from "@/entities/chats";

interface AiState {
	ai: AiTypes | null;
	setAiState: (ai: AiTypes | null) => void;

	response: AiResponse | null;
	clearResponse: () => void;

	sendReqToAi: (
		payload: AiRequest,
		callbacks: {
			addRequest: (chatId: string, request: IRequest) => void;
			updateRequestResponse: (
				chatId: string,
				requestId: string,
				response: string,
			) => void;
		},
	) => Promise<AiResponse | null>;

	loading: boolean;
	setLoading: (value: boolean) => void;

	error: string | null;
	clearError: () => void;
}

export const useAiStore = create<AiState>((set) => ({
	ai: null,
	response: null,
	loading: false,
	error: null,

	sendReqToAi: async (
		{ chatId, prompt, aiProvider },
		{ addRequest, updateRequestResponse },
	) => {
		set({ loading: true, error: null });
		const idForSession = generateCUID();

		try {
			const newRequest: IRequest = {
				id: idForSession,
				createdAt: new Date().toISOString(),
				prompt: prompt,
				response: "",
			};

			addRequest(chatId, newRequest);

			const result = await sendMessageToAi({ chatId, prompt, aiProvider });

			if (result && result.result) {
				updateRequestResponse(chatId, idForSession, result.result);
			}

			set({ response: result, loading: false });
			return result;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Произошла ошибка";
			updateRequestResponse(chatId, idForSession, `Ошибка: ${errorMessage}`);
			set({ error: errorMessage, loading: false, response: null });
			return null;
		}
	},

	setAiState: (aiType) => set({ ai: aiType }),
	setLoading: (val) => set({ loading: val }),
	clearError: () => set({ error: null }),
	clearResponse: () => set({ response: null }),
}));
