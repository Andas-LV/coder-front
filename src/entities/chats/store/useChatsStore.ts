import { create } from "zustand";
import * as service from "@/entities/chats/service/chats.service";
import type {
	IChatsList,
	IChatById,
	ICreateChat,
	IRequest,
	IUpdateChat,
} from "@/entities/chats/types/chatsTypes";
import { getErrorMessage } from "@/shared/api/errors";

interface ChatsState {
	chats: IChatsList[] | null;
	chatById: IChatById | null;
	/** загрузка списка чатов (сайдбар) */
	loading: boolean;
	/** загрузка открытого чата */
	chatLoading: boolean;
	error: string | null;

	createChat: (payload: ICreateChat) => Promise<string | undefined>;
	getChats: () => Promise<void>;
	getChatById: (id: string) => Promise<void>;
	/** true — успешно; при ошибке текст лежит в `error` */
	updateChat: (id: string, payload: IUpdateChat) => Promise<boolean>;
	deleteChat: (id: string) => Promise<boolean>;
	clearChat: () => void;

	// Локальные обновления открытого чата (оптимистичный UI / стриминг)
	addRequest: (chatId: string, request: IRequest) => void;
	updateRequestResponse: (chatId: string, requestId: string, response: string) => void;
	patchRequest: (chatId: string, requestId: string, patch: Partial<IRequest>) => void;
	removeRequest: (chatId: string, requestId: string) => void;
	/** поднять чат наверх списка после нового сообщения */
	touchChat: (chatId: string, updatedAt?: string) => void;
}

export const useChatsStore = create<ChatsState>((set, get) => ({
	chats: null,
	chatById: null,
	loading: false,
	chatLoading: false,
	error: null,

	createChat: async (payload) => {
		set({ error: null });
		try {
			const newChat = await service.createChat(payload);
			const { chats } = get();
			set({ chats: chats ? [newChat, ...chats] : [newChat] });
			return newChat.id;
		} catch (err) {
			set({ error: getErrorMessage(err) });
		}
	},

	getChats: async () => {
		set({ loading: true, error: null });
		try {
			const result = await service.fetchChats();
			set({ chats: result, loading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), loading: false });
		}
	},

	getChatById: async (id) => {
		// не показываем старый чат, пока грузится новый
		if (get().chatById?.id !== id) set({ chatById: null });
		set({ chatLoading: true, error: null });
		try {
			const result = await service.fetchChatById(id);
			set({ chatById: result, chatLoading: false });
		} catch (err) {
			set({ error: getErrorMessage(err), chatLoading: false });
		}
	},

	updateChat: async (id, payload) => {
		set({ error: null });
		try {
			const updated = await service.updateChat(id, payload);
			const { chats, chatById } = get();
			set({
				chats: chats?.map((c) => (c.id === id ? { ...c, ...updated } : c)) ?? null,
				chatById: chatById?.id === id ? { ...chatById, ...updated } : chatById,
			});
			return true;
		} catch (err) {
			set({ error: getErrorMessage(err) });
			return false;
		}
	},

	deleteChat: async (id) => {
		set({ error: null });
		try {
			await service.deleteChat(id);
			const { chats, chatById } = get();
			set({
				chats: chats?.filter((c) => c.id !== id) ?? null,
				chatById: chatById?.id === id ? null : chatById,
			});
			return true;
		} catch (err) {
			set({ error: getErrorMessage(err) });
			return false;
		}
	},

	clearChat: () => set({ chatById: null }),

	addRequest: (chatId, request) => {
		const { chatById } = get();
		if (chatById?.id !== chatId) return;
		set({ chatById: { ...chatById, requests: [...chatById.requests, request] } });
	},

	updateRequestResponse: (chatId, requestId, response) => {
		get().patchRequest(chatId, requestId, { response });
	},

	patchRequest: (chatId, requestId, patch) => {
		const { chatById } = get();
		if (chatById?.id !== chatId) return;
		set({
			chatById: {
				...chatById,
				requests: chatById.requests.map((r) =>
					r.id === requestId ? { ...r, ...patch } : r,
				),
			},
		});
	},

	removeRequest: (chatId, requestId) => {
		const { chatById } = get();
		if (chatById?.id !== chatId) return;
		set({
			chatById: {
				...chatById,
				requests: chatById.requests.filter((r) => r.id !== requestId),
			},
		});
	},

	touchChat: (chatId, updatedAt = new Date().toISOString()) => {
		const { chats, chatById } = get();
		if (chats) {
			const chat = chats.find((c) => c.id === chatId);
			if (chat) {
				set({
					chats: [{ ...chat, updatedAt }, ...chats.filter((c) => c.id !== chatId)],
				});
			}
		}
		if (chatById?.id === chatId) set({ chatById: { ...chatById, updatedAt } });
	},
}));
