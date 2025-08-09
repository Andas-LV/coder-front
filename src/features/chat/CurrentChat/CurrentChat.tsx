"use client";
import React, { useEffect, useRef, useState } from "react";

import styles from "./CurrentChat.module.scss";
import { ChatMessages } from "@/features/chat/ui/ChatMessages/ChatMessages";
import { ChatInput } from "@/features/chat/ui/ChatInput/ChatInput";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import { ScrollToBottomButton } from "@/shared/components/Buttons";

interface CurrentChatProps {
	chatId: string | null;
}

export const CurrentChat = ({ chatId }: CurrentChatProps) => {
	const { setAiState } = useAiStore();
	const { chatById, getChatById, loading } = useChatsStore();

	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
		null,
	);

	useEffect(() => {
		if (scrollAreaRef.current) {
			const container = scrollAreaRef.current.querySelector(
				'[data-slot="scroll-area-viewport"]',
			) as HTMLElement;
			setScrollContainer(container);
		}
	}, []);

	useEffect(() => {
		if (scrollContainer && loading) {
			const timer = setTimeout(() => {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: "smooth",
				});
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [loading, scrollContainer]);

	useEffect(() => {
		setAiState(chatById?.aiProvider || null);
	}, [chatById]);

	useEffect(() => {
		if (chatId) {
			getChatById(chatId);
		}
	}, [chatId, getChatById]);

	return (
		<div className="relative">
			<ScrollArea className={styles.aiPage} ref={scrollAreaRef}>
				<ChatMessages />
				<ChatInput />
			</ScrollArea>

			<ScrollToBottomButton scrollContainer={scrollContainer} />
		</div>
	);
};
