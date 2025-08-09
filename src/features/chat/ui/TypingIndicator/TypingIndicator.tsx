"use client";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import styles from "./TypingIndicator.module.scss";
import { AI_INFO } from "../../const";
import { AiTypes } from "@/shared/types/AiTypes";

interface TypingIndicatorProps {
	ai: AiTypes;
}

export const TypingIndicator = ({ ai }: TypingIndicatorProps) => {
	const aiInfo = AI_INFO[ai];
	const IconComponent = aiInfo.icon;

	return (
		<div className={styles.messageContainer}>
			<div className={styles.messageContent}>
				<Avatar className={styles.messageAvatar}>
					<AvatarFallback style={{ backgroundColor: `${aiInfo.color}15` }}>
						<IconComponent
							className={styles.avatarIcon}
							style={{ color: aiInfo.color }}
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
