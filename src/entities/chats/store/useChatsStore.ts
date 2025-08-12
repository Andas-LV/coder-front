import { create } from "zustand";
import * as service from "@/entities/chats/service/chats.service";
import type {
	IChatsList,
	IChatById,
	ICreateChat,
	IRequest,
} from "@/entities/chats/types/chatsTypes";
import { messagesDB } from "@/entities/chats/lib/messages.db";

interface ChatsState {
	chats: IChatsList[] | null;
	chatById: IChatById | null;
	loading: boolean;
	error: string | null;
	createChat: (payload: ICreateChat) => Promise<string | undefined>;
	getChats: () => Promise<void>;
	getChatById: (id: string) => Promise<void>;
	updateChat: (id: string, payload: Partial<IChatById>) => Promise<void>;
	deleteChat: (id: string) => Promise<void>;
	// Методы для обновления сообщений в реальном времени
	addRequest: (chatId: string, request: IRequest) => void;
	updateRequestResponse: (
		chatId: string,
		requestId: string,
		response: string,
	) => void;
}

export const useChatsStore = create<ChatsState>((set, get) => ({
	chats: null,
	chatById: null,
	loading: false,
	error: null,

	createChat: async (payload) => {
		set({ loading: true, error: null });
		try {
			const newChat = await service.createChat(payload);
			if (!newChat) return;

			const { chats } = get();
			set({
				chats: chats ? [newChat, ...chats] : [newChat],
				loading: false,
			});

			return newChat.id;
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},

	getChats: async () => {
		set({ loading: true, error: null });
		try {
			const result = await service.fetchChats();
			set({ chats: result, loading: false });
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},

	getChatById: async (id) => {
		set({ loading: true, error: null });
		try {
			const result = await service.fetchChatById(id);
			set({ chatById: result, loading: false });
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},

	updateChat: async (id, payload) => {
		set({ loading: true, error: null });
		try {
			const result = await service.updateChat(id, payload);
			const { chats } = get();
			if (chats) {
				const updatedChats = chats.map((chat) =>
					chat.id === id ? { ...chat, ...result } : chat,
				);
				set({ chats: updatedChats, loading: false });
			}
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},

	deleteChat: async (id) => {
		set({ loading: true, error: null });
		try {
			await service.deleteChat(id);
			const { chats, chatById } = get();

			if (chats) {
				const updatedChats = chats.filter((chat) => chat.id !== id);
				set({
					chats: updatedChats,
					chatById: chatById?.id === id ? null : chatById,
					loading: false,
				});
			}
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},

	addRequest: async (chatId, request) => {
		const { chatById } = get();
		set({ loading: true, error: null });

		if (chatById && chatById.id === chatId) {
			set({
				chatById: {
					...chatById,
					requests: [...chatById.requests, request],
				},
				loading: false,
			});
		}

		await messagesDB.messages.put({ ...request, chatId });
	},

	updateRequestResponse: async (chatId, requestId, response) => {
		const { chatById } = get();
		set({ loading: true, error: null });
		if (chatById && chatById.id === chatId) {
			const updatedRequests = chatById.requests.map((request) =>
				request.id === requestId ? { ...request, response } : request,
			);

			set({
				chatById: {
					...chatById,
					requests: updatedRequests,
				},
				loading: false,
			});
		}

		await messagesDB.messages.update(requestId, { response });
	},
}));
