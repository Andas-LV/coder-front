import axiosInstance from "@/shared/api/axiosInstance";
import {
	ICreateChat,
	IChatById,
	IChatsList,
} from "@/entities/chats/types/chatsTypes";

export async function fetchChats(): Promise<IChatsList[]> {
	const { data } = await axiosInstance.get("/chats/list");
	return data;
}

export async function createChat(payload: ICreateChat): Promise<IChatsList> {
	const { data } = await axiosInstance.post("/chats/create", payload);
	return data;
}

export async function fetchChatById(id: string): Promise<IChatById> {
	const { data } = await axiosInstance.get(`/chats/${id}`);
	return data;
}

export async function updateChat(
	id: string,
	payload: Partial<IChatById>,
): Promise<IChatsList[]> {
	const { data } = await axiosInstance.patch(`/chats/${id}/update`, payload);
	return data;
}

export async function deleteChat(id: string): Promise<IChatsList[]> {
	const { data } = await axiosInstance.delete(`/chats/${id}/delete`);
	return data;
}
