"use client";

import { useState } from "react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { useChatsStore } from "@/entities/chats";
import type { IChatsList } from "@/entities/chats/types/chatsTypes";
import styles from "./ChatsSidebar.module.scss";
import { CreateChatDropdown } from "@/widgets/ChatsSidebar/ui/CreateChatDropdown/CreateChatDropdown";
import { SearchInput } from "@/widgets/ChatsSidebar/ui/SearchInput/SearchInput";
import { ChatsList } from "@/widgets/ChatsSidebar/ui/ChatsList/ChatsList";

interface ChatsSidebarProps {
	chats: IChatsList[] | null;
	selectedChatId: string | null;
	onChatSelect: (chatId: string) => void;
}

export const ChatsSidebar = ({
	chats,
	selectedChatId,
	onChatSelect,
}: ChatsSidebarProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const { loading } = useChatsStore();

	const filteredChats =
		chats?.filter((chat) =>
			chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];

	return (
		<div className={styles.sidebar}>
			<CreateChatDropdown onChatSelect={onChatSelect} />
			<SearchInput value={searchQuery} onChange={setSearchQuery} />

			<ScrollArea className={styles.chatsList}>
				{loading ? (
					<div className={styles.loading}>
						<div className={styles.spinner} />
						<span>Загрузка чатов...</span>
					</div>
				) : filteredChats.length === 0 ? (
					<div className={styles.empty}>
						<MessageSquare className={styles.icon} />
						<p>Нет чатов</p>
						<span>Создайте новый чат для начала</span>
					</div>
				) : (
					<ChatsList
						chats={filteredChats}
						selectedChatId={selectedChatId}
						onSelect={onChatSelect}
					/>
				)}
			</ScrollArea>
		</div>
	);
};
