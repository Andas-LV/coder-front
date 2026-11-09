"use client";

import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useChatsStore } from "@/entities/chats";
import { getModelInfo, useModelsStore } from "@/entities/models";
import styles from "./CreateChatDropdown.module.scss";

interface Props {
	onChatSelect: (chatId: string) => void;
}

export const CreateChatDropdown = ({ onChatSelect }: Props) => {
	const { createChat } = useChatsStore();
	const { models, defaultModel, loading, error, load } = useModelsStore();

	const handleCreate = async (model: string) => {
		const newChatId = await createChat({ model });
		if (newChatId) onChatSelect(newChatId);
		else toast.error(useChatsStore.getState().error ?? "Не удалось создать чат");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" className={styles.createButton}>
					<Plus className={styles.icon} />
					Новый чат
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
				<DropdownMenuLabel>Модель</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{loading && models.length === 0 && (
					<DropdownMenuItem disabled>
						<Loader2 className="animate-spin" />
						Загрузка моделей...
					</DropdownMenuItem>
				)}

				{error && models.length === 0 && (
					<DropdownMenuItem
						onSelect={(e) => {
							e.preventDefault();
							load(true);
						}}
					>
						<RefreshCw />
						Повторить загрузку
					</DropdownMenuItem>
				)}

				{models.map((m) => {
					const info = getModelInfo(m);
					const Icon = info.icon;
					return (
						<DropdownMenuItem key={m} onClick={() => handleCreate(m)}>
							<Icon style={{ color: info.color }} />
							<span>{m}</span>
							{m === defaultModel && (
								<span className="ml-auto text-xs opacity-60">по умолчанию</span>
							)}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
