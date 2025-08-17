"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { IChatById, useChatsStore } from "@/entities/chats";
import { IChatsList } from "@/entities/chats/types/chatsTypes";
import { ModalLayout } from "@/shared/layouts/ModalLayout/ModalLayout";
import * as React from "react";

interface Props {
	chat: IChatsList | IChatById;
	open: boolean;
	onOpenChange: (val: boolean) => void;
}

export const RenameChatModal = ({ chat, open, onOpenChange }: Props) => {
	const { updateChat } = useChatsStore();
	const [name, setName] = useState(chat.name);
	const [loading, setLoading] = useState(false);

	const handleRename = async () => {
		setLoading(true);
		await updateChat(chat.id, { name });
		setLoading(false);
		onOpenChange(false);
	};

	return (
		<ModalLayout
			open={open}
			onOpenChange={onOpenChange}
			title="Переименовать чат"
			description="Введите новое имя для чата"
			footer={
				<Button onClick={handleRename} disabled={loading || !name.trim()}>
					Сохранить
				</Button>
			}
		>
			<Input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Новое имя чата"
			/>
		</ModalLayout>
	);
};
