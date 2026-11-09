"use client";

import styles from "./ChatMessages.module.scss";
import { MessageBubble } from "@/features/chat/ui/MessageBubble/MessageBubble";
import { TypingIndicator } from "@/features/chat/ui/TypingIndicator/TypingIndicator";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import { useModelsStore } from "@/entities/models";

export const ChatMessages = () => {
	const { waitingFirstToken, indexing } = useAiStore();
	const { chatById, chatLoading } = useChatsStore();
	const { defaultModel } = useModelsStore();

	if (!chatById) {
		return chatLoading ? (
			<div className={styles.messagesArea}>
				<div className={styles.emptyState}>
					<p>Загрузка чата...</p>
				</div>
			</div>
		) : null;
	}

	return (
		<div>
			<div className={styles.messagesArea}>
				<div className={styles.messagesContainer}>
					{chatById.requests.length === 0 && (
						<div className={styles.emptyState}>
							<h3>Начните разговор</h3>
							<p>Задайте любой вопрос, и ИИ поможет вам найти ответ</p>
						</div>
					)}
					{chatById.requests.map((request) => (
						<MessageBubble key={request.id} request={request} />
					))}
					{waitingFirstToken && (
						<TypingIndicator model={chatById.model ?? defaultModel} indexing={indexing} />
					)}
				</div>
			</div>
		</div>
	);
};
