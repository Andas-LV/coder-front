"use client";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Settings, MoreVertical, AlertCircle } from "lucide-react";
import styles from "./ChatHeader.module.scss";
import { AI_INFO } from "../../const";
import { useAiStore } from "@/entities/ai";

interface ChatHeaderProps {}

export const ChatHeader = ({}: ChatHeaderProps) => {
	const { ai, error, clearError } = useAiStore();

	if (!ai) return null;

	const aiInfo = AI_INFO[ai];
	const IconComponent = aiInfo.icon;

	return (
		<div className={styles.chatHeader}>
			<div className={styles.aiInfo}>
				<Avatar className={styles.aiAvatar}>
					<AvatarFallback style={{ backgroundColor: `${aiInfo.color}15` }}>
						<IconComponent
							className={styles.aiIcon}
							style={{ color: aiInfo.color }}
						/>
					</AvatarFallback>
				</Avatar>
				<div className={styles.aiDetails}>
					<h2 className={styles.aiName}>{aiInfo.name}</h2>
					<p className={styles.aiDescription}>{aiInfo.description}</p>
					{error && (
						<div className={styles.errorMessage}>
							<AlertCircle className={styles.errorIcon} />
							<span>{error}</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearError}
								className={styles.clearError}
							>
								✕
							</Button>
						</div>
					)}
				</div>
			</div>

			<div className={styles.headerActions}>
				<Button variant="ghost" size="icon" className={styles.actionButton}>
					<Settings className={styles.actionIcon} />
				</Button>
				<Button variant="ghost" size="icon" className={styles.actionButton}>
					<MoreVertical className={styles.actionIcon} />
				</Button>
			</div>
		</div>
	);
};
