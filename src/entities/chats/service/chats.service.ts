import axiosInstance from "@/shared/api/axiosInstance";
import type {
	ChatDetailDto,
	ChatFileUrlDto,
	ChatOutDto,
	IChatFileUrl,
	IChatById,
	IChatsList,
	ICreateChat,
	IUpdateChat,
} from "@/entities/chats/types/chatsTypes";
import {
	toChat,
	toChatById,
	toCreateChatDto,
	toUpdateChatDto,
} from "@/entities/chats/lib/mappers";

export async function fetchChats(): Promise<IChatsList[]> {
	const { data } = await axiosInstance.get<ChatOutDto[]>("/chats");
	return data.map(toChat);
}

export async function createChat(payload: ICreateChat): Promise<IChatsList> {
	const { data } = await axiosInstance.post<ChatOutDto>(
		"/chats",
		toCreateChatDto(payload),
	);
	return toChat(data);
}

export async function fetchChatById(id: string): Promise<IChatById> {
	const { data } = await axiosInstance.get<ChatDetailDto>(`/chats/${id}`);
	return toChatById(data);
}

// ⚠️ PATCH /chats/{id} и DELETE /chats/{id} пока не реализованы в FastAPI
// (см. FRONTEND_MIGRATION.md, раздел 7) — до этого вернут 404/405.
export async function updateChat(
	id: string,
	payload: IUpdateChat,
): Promise<IChatsList> {
	const { data } = await axiosInstance.patch<ChatOutDto>(
		`/chats/${id}`,
		toUpdateChatDto(payload),
	);
	return toChat(data);
}

/** Запас, чтобы ссылка не протухла, пока PDF открывается. */
const FILE_URL_SAFETY_MS = 60_000;
const fileUrlCache = new Map<string, IChatFileUrl>();

/** Временная ссылка на оригинал PDF из чата; переиспользуется, пока не истекла. */
export async function fetchChatFileUrl(chatId: string, documentId: string): Promise<IChatFileUrl> {
	const key = `${chatId}/${documentId}`;
	const cached = fileUrlCache.get(key);
	if (cached && cached.expiresAt - FILE_URL_SAFETY_MS > Date.now()) return cached;

	const { data } = await axiosInstance.get<ChatFileUrlDto>(`/chats/${chatId}/files/${documentId}`);
	const file: IChatFileUrl = {
		url: data.url,
		filename: data.filename,
		expiresAt: Date.now() + data.expires_in * 1000,
	};
	fileUrlCache.set(key, file);
	return file;
}

export async function deleteChat(id: string): Promise<void> {
	await axiosInstance.delete(`/chats/${id}`);
}
