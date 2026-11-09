"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { IChatById, IChatsList, useChatsStore } from "@/entities/chats";
import { ModalLayout } from "@/shared/layouts/ModalLayout/ModalLayout";

interface Props {
	chat: IChatsList | IChatById;
	open: boolean;
	onOpenChange: (val: boolean) => void;
}

export const RenameChatModal = ({ chat, open, onOpenChange }: Props) => {
	const { updateChat } = useChatsStore();
	const [title, setTitle] = useState(chat.title);
	const [loading, setLoading] = useState(false);

	const handleRename = async () => {
		setLoading(true);
		const ok = await updateChat(chat.id, { title: title.trim() });
		setLoading(false);
		if (ok) {
			onOpenChange(false);
		} else {
			toast.error(useChatsStore.getState().error ?? "Не удалось переименовать чат");
		}
	};

	return (
		<ModalLayout
			open={open}
			onOpenChange={onOpenChange}
			title="Переименовать чат"
			description="Введите новое имя для чата"
			footer={
				<Button onClick={handleRename} disabled={loading || !title.trim()}>
					Сохранить
				</Button>
			}
		>
			<Input
				value={title}
				maxLength={255}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && title.trim() && handleRename()}
				placeholder="Новое имя чата"
			/>
		</ModalLayout>
	);
};
