"use client";

import styles from "./ChatMessages.module.scss";
import { MessageBubble } from "@/features/chat/ui/MessageBubble/MessageBubble";
import { TypingIndicator } from "@/features/chat/ui/TypingIndicator/TypingIndicator";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";

export const ChatMessages = () => {
	const { ai, loading } = useAiStore();
	const { chatById } = useChatsStore();

	if (!ai || !chatById) return null;

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
					{loading && <TypingIndicator ai={ai} />}
				</div>
			</div>
		</div>
	);
};
