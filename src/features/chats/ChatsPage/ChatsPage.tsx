"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { ChatsSidebar } from "@/widgets/ChatsSidebar/ChatsSidebar";
import styles from "./ChatsPage.module.scss";
import { CurrentChat } from "@/features/chat/CurrentChat/CurrentChat";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/shared/components/ui/resizable";
import { useChatsStore } from "@/entities/chats";
import useIsMobile from "@/shared/hooks/useIsMobile";
import { useModelsStore } from "@/entities/models";

export default function ChatsPageComponent() {
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const { chats, getChats, clearChat } = useChatsStore();
	const loadModels = useModelsStore((s) => s.load);
	const isMobile = useIsMobile();
	const [isChatOpen, setIsChatOpen] = useState(false);

	useEffect(() => {
		getChats();
		// список моделей грузим один раз (первый запрос к бэкенду может идти ~7 с)
		loadModels();
	}, [getChats, loadModels]);

	// /chats?chat=<id> — открыть конкретный чат (например, со страницы ресурсов)
	useEffect(() => {
		const id = new URLSearchParams(window.location.search).get("chat");
		if (id) {
			setSelectedChatId(id);
			setIsChatOpen(true);
		}
	}, []);

	// чат удалён — сбрасываем выбор
	useEffect(() => {
		if (selectedChatId && chats && !chats.some((c) => c.id === selectedChatId)) {
			setSelectedChatId(null);
			setIsChatOpen(false);
		}
	}, [chats, selectedChatId]);

	const handleChatSelect = (chatId: string) => {
		setSelectedChatId(chatId);
		if (isMobile) {
			setIsChatOpen(true);
		}
	};

	const handleBack = () => {
		setIsChatOpen(false);
		setSelectedChatId(null);
		clearChat();
	};

	if (isMobile) {
		return (
			<div className={styles.chatsPage}>
				{isChatOpen && selectedChatId ? (
					<div className={styles.mainContent}>
						<CurrentChat chatId={selectedChatId} onBack={handleBack} />
					</div>
				) : (
					<div className={styles.sidebar}>
						<ChatsSidebar
							chats={chats}
							selectedChatId={selectedChatId}
							onChatSelect={handleChatSelect}
						/>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={styles.chatsPage}>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={30} minSize={15}>
					<div className={styles.sidebar}>
						<ChatsSidebar
							chats={chats}
							selectedChatId={selectedChatId}
							onChatSelect={handleChatSelect}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={70} minSize={35}>
					<div className={styles.mainContent}>
						{selectedChatId ? (
							<CurrentChat chatId={selectedChatId} />
						) : (
							<div className={styles.emptyState}>
								<div className={styles.emptyContent}>
									<h2>Выберите чат</h2>
									<p>Выберите чат из списка слева или создайте новый</p>
								</div>
							</div>
						)}
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
