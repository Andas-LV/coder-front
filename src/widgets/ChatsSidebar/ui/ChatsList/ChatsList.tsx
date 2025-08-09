"use client";

import styles from "./ChatsList.module.scss";
import { IChatsList } from "@/entities/chats/types/chatsTypes";
import { ChatItem } from "../ChatItem/ChatItem";

interface Props {
	chats: IChatsList[];
	selectedChatId: string | null;
	onSelect: (chatId: string) => void;
}

export const ChatsList = ({ chats, selectedChatId, onSelect }: Props) => {
	return (
		<div className={styles.chatsContainer}>
			{chats.map((chat) => (
				<ChatItem
					key={chat.id}
					chat={chat}
					selected={chat.id === selectedChatId}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
};
