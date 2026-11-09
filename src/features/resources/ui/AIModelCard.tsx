"use client";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MessageCircle } from "lucide-react";
import { getModelInfo } from "@/entities/models";
import styles from "../Resources.module.scss";

interface AIModelCardProps {
	model: string;
	isDefault?: boolean;
	disabled?: boolean;
	onStartChat: (model: string) => void;
}

export default function AIModelCard({
	model,
	isDefault,
	disabled,
	onStartChat,
}: AIModelCardProps) {
	const info = getModelInfo(model);
	const Icon = info.icon;

	return (
		<Card className={styles.modelCard}>
			<CardContent className={styles.cardContent}>
				<div className={styles.iconSection}>
					<div
						className={styles.iconWrapper}
						style={{ backgroundColor: `${info.color}15` }}
					>
						<Icon className={styles.aiIcon} style={{ color: info.color }} />
					</div>
				</div>

				<div className={styles.contentSection}>
					<div className={styles.modelHeader}>
						<h3 className={styles.modelName}>{info.name}</h3>
						<span className={styles.company}>
							{info.company}
							{isDefault && " · по умолчанию"}
						</span>
					</div>

					<p className={styles.description}>{info.description}</p>

					{info.features.length > 0 && (
						<div className={styles.features}>
							{info.features.map((feature) => (
								<span key={feature} className={styles.feature}>
									{feature}
								</span>
							))}
						</div>
					)}
				</div>

				<div className={styles.actionSection}>
					<Button
						onClick={() => onStartChat(model)}
						disabled={disabled}
						className={styles.chatButton}
						style={{ backgroundColor: info.color }}
					>
						<MessageCircle className={styles.buttonIcon} />
						Начать чат
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
