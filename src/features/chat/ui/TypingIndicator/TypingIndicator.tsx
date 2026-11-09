"use client";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import styles from "./TypingIndicator.module.scss";
import { getModelInfo } from "@/entities/models";

interface TypingIndicatorProps {
	model: string | null;
}

export const TypingIndicator = ({ model }: TypingIndicatorProps) => {
	const info = getModelInfo(model);
	const IconComponent = info.icon;

	return (
		<div className={styles.messageContainer}>
			<div className={styles.messageContent}>
				<Avatar className={styles.messageAvatar}>
					<AvatarFallback style={{ backgroundColor: `${info.color}15` }}>
						<IconComponent
							className={styles.avatarIcon}
							style={{ color: info.color }}
						/>
					</AvatarFallback>
				</Avatar>

				<div className={styles.typingBubble}>
					<div className={styles.typingDots}>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		</div>
	);
};
