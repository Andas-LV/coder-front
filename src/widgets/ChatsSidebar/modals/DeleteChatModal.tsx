"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { IChatById, IChatsList, useChatsStore } from "@/entities/chats";
import { ModalLayout } from "@/shared/layouts/ModalLayout/ModalLayout";

interface Props {
	chat: IChatsList | IChatById;
	open: boolean;
	onOpenChange: (val: boolean) => void;
}

export const DeleteChatModal = ({ chat, open, onOpenChange }: Props) => {
	const { deleteChat } = useChatsStore();
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		const ok = await deleteChat(chat.id);
		setLoading(false);
		if (ok) {
			onOpenChange(false);
		} else {
			toast.error(useChatsStore.getState().error ?? "Не удалось удалить чат");
		}
	};

	return (
		<ModalLayout
			open={open}
			onOpenChange={onOpenChange}
			title="Удалить чат"
			description="Вы уверены, что хотите удалить чат? Это действие необратимо."
			footer={
				<Button variant="destructive" onClick={handleDelete} disabled={loading}>
					Удалить
				</Button>
			}
		>
			<p>
				Чат <strong>«{chat.title}»</strong> будет удалён навсегда.
			</p>
		</ModalLayout>
	);
};
