"use client";

import { Badge } from "@/shared/components/ui/badge";
import { formatDate } from "../../utils/formatDate";
import { IChatsList } from "@/entities/chats/types/chatsTypes";
import { getModelInfo, useModelsStore } from "@/entities/models";
import { ChatItemMenu } from "../ChatItemMenu/ChatItemMenu";
import styles from "./ChatItem.module.scss";

interface Props {
	chat: IChatsList;
	selected: boolean;
	onSelect: (chatId: string) => void;
}

export const ChatItem = ({ chat, selected, onSelect }: Props) => {
	const defaultModel = useModelsStore((s) => s.defaultModel);
	const info = getModelInfo(chat.model ?? defaultModel);

	return (
		<div
			className={`${styles.chatItem} ${selected ? styles.selected : ""}`}
			onClick={() => onSelect(chat.id)}
		>
			<div className={styles.chatContent}>
				<div className={styles.chatHeader}>
					<h3 className={styles.chatName}>{chat.title}</h3>
					<ChatItemMenu chat={chat} />
				</div>

				<div className={styles.chatMeta}>
					<Badge
						variant="default"
						className={styles.aiProviderBadge}
						style={{ backgroundColor: info.color }}
					>
						{info.name}
					</Badge>
					<span className={styles.chatDate}>{formatDate(chat.updatedAt)}</span>
				</div>
			</div>
		</div>
	);
};
