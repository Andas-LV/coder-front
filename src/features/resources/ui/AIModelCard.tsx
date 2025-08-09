"use client";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MessageCircle, Sparkles, Brain } from "lucide-react";
import { SiGoogle, SiOpenai, SiMeta } from "react-icons/si";
import { AIModelData, IconType } from "../types";
import styles from "../Resources.module.scss";
import { AiTypes } from "@/shared/types/AiTypes";

interface AIModelCardProps {
	model: AIModelData;
	onStartChat: (modelId: AiTypes) => void;
}

const getIcon = (iconType: IconType, color: string) => {
	const iconProps = {
		className: styles.aiIcon,
		style: { color },
	};

	const iconMap = {
		google: <SiGoogle {...iconProps} />,
		openai: <SiOpenai {...iconProps} />,
		meta: <SiMeta {...iconProps} />,
		brain: <Brain {...iconProps} />,
		sparkles: <Sparkles {...iconProps} />,
	};

	return iconMap[iconType];
};

export default function AIModelCard({ model, onStartChat }: AIModelCardProps) {
	return (
		<Card className={styles.modelCard}>
			<CardContent className={styles.cardContent}>
				<div className={styles.iconSection}>
					<div
						className={styles.iconWrapper}
						style={{ backgroundColor: `${model.color}15` }}
					>
						{getIcon(model.iconType, model.color)}
					</div>
				</div>

				<div className={styles.contentSection}>
					<div className={styles.modelHeader}>
						<h3 className={styles.modelName}>{model.name}</h3>
						<span className={styles.company}>{model.company}</span>
					</div>

					<p className={styles.description}>{model.description}</p>

					<div className={styles.features}>
						{model.features.map((feature, index) => (
							<span key={index} className={styles.feature}>
								{feature}
							</span>
						))}
					</div>
				</div>

				<div className={styles.actionSection}>
					<Button
						onClick={() => onStartChat(model.id)}
						className={styles.chatButton}
						style={{ backgroundColor: model.color }}
					>
						<MessageCircle className={styles.buttonIcon} />
						Начать чат
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
