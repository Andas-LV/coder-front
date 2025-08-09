"use client";
import styles from "./Resources.module.scss";
import AIModelCard from "./ui/AIModelCard";
import { AI_MODELS_DATA } from "./const/AI_MODELS";
import { useRouter } from "next/navigation";
import { routes } from "@/core/config/routes";
import { AiTypes } from "@/shared/types/AiTypes";

export default function Resources() {
	const router = useRouter();

	const handleStartChat = (modelId: AiTypes) => {
		router.push(routes.ai(modelId));
	};

	return (
		<div className={styles.Resources}>
			<div className={styles.modelsGrid}>
				{AI_MODELS_DATA.map((model) => (
					<AIModelCard
						key={model.id}
						model={model}
						onStartChat={handleStartChat}
					/>
				))}
			</div>
		</div>
	);
}
