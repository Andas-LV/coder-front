"use client";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import styles from "./ChatHeader.module.scss";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import { getModelInfo, useModelsStore } from "@/entities/models";
import { ChatItemMenu } from "@/widgets/ChatsSidebar/ui/ChatItemMenu/ChatItemMenu";

interface ChatHeaderProps {
	onBack?: () => void;
}

export const ChatHeader = ({ onBack }: ChatHeaderProps) => {
	const { error, clearError } = useAiStore();
	const { chatById } = useChatsStore();
	const { defaultModel } = useModelsStore();

	if (!chatById) return null;

	const info = getModelInfo(chatById.model ?? defaultModel);
	const IconComponent = info.icon;

	return (
		<div className={styles.chatHeader}>
			<div className={styles.aiInfo}>
				{onBack && (
					<Button
						variant="ghost"
						size="icon"
						className={styles.actionButton}
						onClick={onBack}
					>
						<ArrowLeft className={styles.actionIcon} />
					</Button>
				)}
				<Avatar className={styles.aiAvatar}>
					<AvatarFallback style={{ backgroundColor: `${info.color}15` }}>
						<IconComponent
							className={styles.aiIcon}
							style={{ color: info.color }}
						/>
					</AvatarFallback>
				</Avatar>
				<div className={styles.aiDetails}>
					<h2 className={styles.aiName} title={chatById.title}>
						{chatById.title}
					</h2>
					<span className="text-xs text-muted-foreground">
						{info.name} · {info.company}
					</span>
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

			<ChatItemMenu chat={chatById} />
		</div>
	);
};
