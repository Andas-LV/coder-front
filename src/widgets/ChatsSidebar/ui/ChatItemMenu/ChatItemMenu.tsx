"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { MoreVertical } from "lucide-react";
import { IChatById, IChatsList } from "@/entities/chats/types/chatsTypes";
import styles from "../ChatItem/ChatItem.module.scss";
import { RenameChatModal } from "@/widgets/ChatsSidebar/modals/RenameChatModal";
import { DeleteChatModal } from "@/widgets/ChatsSidebar/modals/DeleteChatModal";
import { useModal } from "@/shared/hooks/useModal";

interface Props {
	chat: IChatsList | IChatById;
}

export const ChatItemMenu = ({ chat }: Props) => {
	const {
		modalData: renameModalData,
		openModal: openRenameModal,
		closeModal: closeRenameModal,
	} = useModal<IChatsList | IChatById>();
	const {
		modalData: deleteModalData,
		openModal: openDeleteModal,
		closeModal: closeDeleteModal,
	} = useModal<IChatsList | IChatById>();

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
							openRenameModal(chat);
						}}
					>
						Переименовать
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation();
							openDeleteModal(chat);
						}}
						className="text-red-600"
					>
						Удалить
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{renameModalData && (
				<RenameChatModal
					chat={renameModalData}
					open={!!renameModalData}
					onOpenChange={closeRenameModal}
				/>
			)}
			{deleteModalData && (
				<DeleteChatModal
					chat={deleteModalData}
					open={!!deleteModalData}
					onOpenChange={closeDeleteModal}
				/>
			)}
		</>
	);
};
