"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Send, Paperclip, Mic } from "lucide-react";
import styles from "./ChatInput.module.scss";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import { useEnterSubmit } from "@/shared/hooks/hotkeys/useEnterSubmit";

export const ChatInput = () => {
	const { ai, loading, sendReqToAi } = useAiStore();
	const { chatById, addRequest, updateRequestResponse } = useChatsStore();

	const [message, setMessage] = useState("");

	if (!ai) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim() && !loading && chatById) {
			const userMessage = message.trim();
			setMessage("");

			try {
				await sendReqToAi(
					{
						prompt: userMessage,
						chatId: chatById.id,
						aiProvider: ai,
					},
					{
						addRequest,
						updateRequestResponse,
					},
				);
			} catch (error) {
				console.error("Ошибка при отправке сообщения:", error);
			}
		}
	};

	const { handleKeyDown } = useEnterSubmit({
		onSubmit: handleSubmit,
		disabled: loading,
		shouldSubmit: !!message.trim(),
	});

	return (
		<div className={styles.chatInput}>
			<form onSubmit={handleSubmit} className={styles.inputForm}>
				<div className={styles.inputContainer}>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={styles.attachButton}
					>
						<Paperclip className={styles.inputIcon} />
					</Button>

					<Textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={"Введите ваше сообщение..."}
						className={styles.messageInput}
						rows={1}
						disabled={loading}
					/>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={styles.voiceButton}
					>
						<Mic className={styles.inputIcon} />
					</Button>

					<Button
						type="submit"
						disabled={!message.trim() || loading}
						className={styles.sendButton}
					>
						<Send className={styles.sendIcon} />
					</Button>
				</div>
			</form>
		</div>
	);
};
