"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { MoreVertical } from "lucide-react";
import { IChatsList } from "@/entities/chats/types/chatsTypes";
import styles from "../ChatItem/ChatItem.module.scss";
import { RenameChatModal } from "@/widgets/ChatsSidebar/modals/RenameChatModal";
import { DeleteChatModal } from "@/widgets/ChatsSidebar/modals/DeleteChatModal";
import * as React from "react";
import { useState } from "react";

interface Props {
	chat: IChatsList;
}

export const ChatItemMenu = ({ chat }: Props) => {
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={styles.chatMenu}
						onClick={(e) => e.stopPropagation()}
					>
						<MoreVertical className={styles.menuIcon} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation();
							setRenameOpen(true);
						}}
					>
						Переименовать
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation();
							setDeleteOpen(true);
						}}
						className="text-red-600"
					>
						Удалить
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<RenameChatModal
				chat={chat}
				open={renameOpen}
				onOpenChange={setRenameOpen}
			/>
			<DeleteChatModal
				chat={chat}
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
			/>
		</>
	);
};
