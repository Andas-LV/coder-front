"use client";

import { Badge } from "@/shared/components/ui/badge";
import { formatDate } from "../../utils/formatDate";
import { IChatsList } from "@/entities/chats/types/chatsTypes";
import { ChatItemMenu } from "../ChatItemMenu/ChatItemMenu";
import styles from "./ChatItem.module.scss";

interface Props {
	chat: IChatsList;
	selected: boolean;
	onSelect: (chatId: string) => void;
}

export const ChatItem = ({ chat, selected, onSelect }: Props) => {
	return (
		<div
			className={`${styles.chatItem} ${selected ? styles.selected : ""}`}
			onClick={() => onSelect(chat.id)}
		>
			<div className={styles.chatContent}>
				<div className={styles.chatHeader}>
					<h3 className={styles.chatName}>{chat.name}</h3>
					<ChatItemMenu chat={chat} />
				</div>

				<div className={styles.chatMeta}>
					<Badge variant="secondary" className={styles.aiProviderBadge}>
						{chat.aiProvider}
					</Badge>
					<span className={styles.chatDate}>{formatDate(chat.updatedAt)}</span>
				</div>
			</div>
		</div>
	);
};
