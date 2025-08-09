"use client";

import { Button } from "@/shared/components/ui/button";
import { ThumbsDown } from "lucide-react";
import { useState } from "react";
import styles from "./Buttons.module.scss";

interface DislikeButtonProps {
	onDislike: () => void;
	className?: string;
	initialDisliked?: boolean;
}

export const DislikeButton = ({
	onDislike,
	className,
	initialDisliked = false,
}: DislikeButtonProps) => {
	const [disliked, setDisliked] = useState(initialDisliked);

	const handleDislike = () => {
		setDisliked(!disliked);
		onDislike();
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={handleDislike}
			className={`${styles.actionButton} ${disliked ? styles.actionButtonActive : ""} ${className || ""}`}
			title={disliked ? "Убрать дизлайк" : "Поставить дизлайк"}
		>
			<ThumbsDown
				className={`${styles.actionIcon} ${disliked ? styles.actionIconActive : ""}`}
			/>
		</Button>
	);
};
