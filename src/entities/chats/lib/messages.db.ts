import Dexie from "dexie";
import type { IRequest } from "@/entities/chats/types/chatsTypes";

export interface IMessage extends IRequest {
	chatId: string;
}

class MessagesDB extends Dexie {
	messages!: Dexie.Table<IMessage, string>;

	constructor() {
		super("MessagesDB");
		this.version(1).stores({
			messages: "id, chatId, createdAt",
		});
	}
}

export const messagesDB = new MessagesDB();
