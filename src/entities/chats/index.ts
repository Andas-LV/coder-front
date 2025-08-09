export {
	fetchChats,
	createChat,
	fetchChatById,
} from "@/entities/chats/service/chats.service";
export * from "@/entities/chats/store/useChatsStore";
export type {
	IChatsList,
	IChatById,
	ICreateChat,
	IRequest,
} from "@/entities/chats/types/chatsTypes";
