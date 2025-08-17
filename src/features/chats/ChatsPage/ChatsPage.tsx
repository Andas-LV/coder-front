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

export default function ChatsPageComponent() {
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const { chats, getChats } = useChatsStore();
	const isMobile = useIsMobile();
	const [isChatOpen, setIsChatOpen] = useState(false);

	useEffect(() => {
		getChats();
	}, [getChats]);

	const handleChatSelect = (chatId: string) => {
		setSelectedChatId(chatId);
		if (isMobile) {
			setIsChatOpen(true);
		}
	};

	const handleBack = () => {
		setIsChatOpen(false);
		setSelectedChatId(null);
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
