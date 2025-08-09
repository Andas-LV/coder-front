"use client";

import { Button } from "@/shared/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import styles from "./Buttons.module.scss";

interface LikeButtonProps {
	onLike: () => void;
	className?: string;
	initialLiked?: boolean;
}

export const LikeButton = ({
	onLike,
	className,
	initialLiked = false,
}: LikeButtonProps) => {
	const [liked, setLiked] = useState(initialLiked);

	const handleLike = () => {
		setLiked(!liked);
		onLike();
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={handleLike}
			className={`${styles.actionButton} ${liked ? styles.actionButtonActive : ""} ${className || ""}`}
			title={liked ? "Убрать лайк" : "Поставить лайк"}
		>
			<ThumbsUp
				className={`${styles.actionIcon} ${liked ? styles.actionIconActive : ""}`}
			/>
		</Button>
	);
};
