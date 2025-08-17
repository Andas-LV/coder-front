"use client";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import styles from "./ChatHeader.module.scss";
import { AI_INFO } from "../../const";
import { useAiStore } from "@/entities/ai";
import { ChatItemMenu } from "@/widgets/ChatsSidebar/ui/ChatItemMenu/ChatItemMenu";
import { useChatsStore } from "@/entities/chats";

interface ChatHeaderProps {
	onBack?: () => void;
}

export const ChatHeader = ({ onBack }: ChatHeaderProps) => {
	const { ai, error, clearError } = useAiStore();
	const { chatById } = useChatsStore()

	if (!ai || !chatById) return null;

	const aiInfo = AI_INFO[ai];
	const IconComponent = aiInfo.icon;

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
					<AvatarFallback style={{ backgroundColor: `${aiInfo.color}15` }}>
						<IconComponent
							className={styles.aiIcon}
							style={{ color: aiInfo.color }}
						/>
					</AvatarFallback>
				</Avatar>
				<div className={styles.aiDetails}>
					<h2 className={styles.aiName}>{aiInfo.name}</h2>
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

			<ChatItemMenu chat={chatById}/>
		</div>
	);
};
