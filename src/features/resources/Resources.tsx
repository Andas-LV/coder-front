"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import styles from "./Resources.module.scss";
import AIModelCard from "./ui/AIModelCard";
import { routes } from "@/core/config/routes";
import { useModelsStore } from "@/entities/models";
import { useChatsStore } from "@/entities/chats";
import { Button } from "@/shared/components/ui/button";

export default function Resources() {
	const router = useRouter();
	const { models, defaultModel, loading, error, load } = useModelsStore();
	const createChat = useChatsStore((s) => s.createChat);
	const [creating, setCreating] = useState<string | null>(null);

	useEffect(() => {
		load();
	}, [load]);

	const handleStartChat = async (model: string) => {
		setCreating(model);
		const chatId = await createChat({ model });
		setCreating(null);
		if (chatId) {
			router.push(routes.chats(chatId));
		} else {
			toast.error(useChatsStore.getState().error ?? "Не удалось создать чат");
		}
	};

	if (loading && models.length === 0) {
		return (
			<div className={styles.Resources}>
				<p className="text-center opacity-70">Загрузка доступных моделей...</p>
			</div>
		);
	}

	if (error && models.length === 0) {
		return (
			<div className={styles.Resources}>
				<div className="flex flex-col items-center gap-3">
					<p className="opacity-70">Не удалось загрузить модели: {error}</p>
					<Button onClick={() => load(true)}>Повторить</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.Resources}>
			<div className={styles.modelsGrid}>
				{models.map((model) => (
					<AIModelCard
						key={model}
						model={model}
						isDefault={model === defaultModel}
						disabled={creating !== null}
						onStartChat={handleStartChat}
					/>
				))}
			</div>
		</div>
	);
}
