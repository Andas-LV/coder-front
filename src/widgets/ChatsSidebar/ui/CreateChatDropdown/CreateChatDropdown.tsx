"use client";

import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { useChatsStore } from "@/entities/chats";
import { AI_MODELS_DATA } from "@/features/resources/const/AI_MODELS";
import { AiTypes } from "@/shared/types/AiTypes";
import styles from "./CreateChatDropdown.module.scss";

interface Props {
	onChatSelect: (chatId: string) => void;
}

export const CreateChatDropdown = ({ onChatSelect }: Props) => {
	const { createChat } = useChatsStore();

	const handleCreate = async (aiProvider: AiTypes) => {
		const newChatId = await createChat({ aiProvider });
		if (newChatId) onChatSelect(newChatId);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" className={styles.createButton}>
					<Plus className={styles.icon} />
					Новый чат
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{AI_MODELS_DATA.map((model) => (
					<DropdownMenuItem
						key={model.id}
						onClick={() => handleCreate(model.id)}
					>
						{model.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
