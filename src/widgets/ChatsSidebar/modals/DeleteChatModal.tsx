"use client";

import { Button } from "@/shared/components/ui/button";
import { useChatsStore } from "@/entities/chats";
import { IChatsList } from "@/entities/chats/types/chatsTypes";
import { ModalLayout } from "@/shared/layouts/ModalLayout/ModalLayout";
import * as React from "react";

interface Props {
	chat: IChatsList;
	open: boolean;
	onOpenChange: (val: boolean) => void;
}

export const DeleteChatModal = ({ chat, open, onOpenChange }: Props) => {
	const { deleteChat } = useChatsStore();

	const handleDelete = async () => {
		await deleteChat(chat.id);
	};

	return (
		<ModalLayout
			open={open}
			onOpenChange={onOpenChange}
			title="Удалить чат"
			description="Вы уверены, что хотите удалить чат? Это действие необратимо."
			footer={
				<Button variant="destructive" onClick={handleDelete}>
					Удалить
				</Button>
			}
		>
			<p>
				Чат <strong>«{chat.name}»</strong> будет удалён навсегда.
			</p>
		</ModalLayout>
	);
};
