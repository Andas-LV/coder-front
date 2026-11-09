"use client";
import React, { useEffect, useRef, useState } from "react";

import styles from "./CurrentChat.module.scss";
import { ChatMessages } from "@/features/chat/ui/ChatMessages/ChatMessages";
import { ChatInput } from "@/features/chat/ui/ChatInput/ChatInput";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import { ScrollToBottomButton } from "@/shared/components/Buttons";
import { ChatHeader } from "../ui/ChatHeader/ChatHeader";
import { PdfViewerModal } from "../ui/PdfViewer/PdfViewerModal";
import useIsMobile from "@/shared/hooks/useIsMobile";

interface CurrentChatProps {
	chatId: string | null;
	onBack?: () => void;
}

export const CurrentChat = ({ chatId, onBack }: CurrentChatProps) => {
	const isMobile = useIsMobile();

	const { setModel } = useAiStore();
	const { chatById, getChatById } = useChatsStore();
	const lastResponse = chatById?.requests.at(-1)?.response;
	const requestsCount = chatById?.requests.length ?? 0;

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

	// Новое сообщение — всегда вниз
	useEffect(() => {
		if (!scrollContainer) return;
		const timer = setTimeout(() => {
			scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
		}, 50);
		return () => clearTimeout(timer);
	}, [requestsCount, chatById?.id, scrollContainer]);

	// Стриминг — прокручиваем, только если пользователь и так внизу
	useEffect(() => {
		if (!scrollContainer) return;
		const { scrollHeight, scrollTop, clientHeight } = scrollContainer;
		if (scrollHeight - scrollTop - clientHeight < 160) {
			scrollContainer.scrollTop = scrollHeight;
		}
	}, [lastResponse, scrollContainer]);

	useEffect(() => {
		setModel(chatById?.model ?? null);
	}, [chatById?.model, setModel]);

	useEffect(() => {
		if (chatId) {
			getChatById(chatId);
		}
	}, [chatId, getChatById]);

	return (
		<div className="relative">
			{isMobile && <ChatHeader onBack={onBack} />}

			<ScrollArea className={styles.aiPage} ref={scrollAreaRef}>
				<ChatMessages />
				<ChatInput />
			</ScrollArea>

			<ScrollToBottomButton scrollContainer={scrollContainer} />
			<PdfViewerModal />
		</div>
	);
};
