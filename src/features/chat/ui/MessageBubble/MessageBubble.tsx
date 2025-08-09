"use client";

import ReactMarkdown from "react-markdown";
import styles from "./MessageBubble.module.scss";
import { Avatar } from "@/shared/components/Avatar/Avatar";
import {
	CopyButton,
	DislikeButton,
	LikeButton,
} from "@/shared/components/Buttons";
import { formatTimeOnly } from "@/shared/utils/formatDate";
import { IRequest } from "@/entities/chats";

interface MessageBubbleProps {
	request: IRequest;
}

export const MessageBubble = ({ request }: MessageBubbleProps) => {
	const handleLike = () => {
		console.log("Liked message:", request.id);
	};

	const handleDislike = () => {
		console.log("Disliked message:", request.id);
	};

	return (
		<div className={styles.messageContainer}>
			<div className={styles.userMessage}>
				<Avatar />

				<div className={styles.messageContent}>
					<div className={styles.messageText}>
						{request.prompt}

						<div className={styles.messageActions}>
							<CopyButton text={request.prompt} />
							{formatTimeOnly(request.createdAt)}
						</div>
					</div>
				</div>
			</div>

			{request.response && (
				<div className={styles.aiMessage}>
					<div className={styles.messageContent}>
						<div className={styles.messageText}>
							<ReactMarkdown >{request.response}</ReactMarkdown>

							<div className={styles.messageActions}>
								<CopyButton text={request.response} />
								<LikeButton onLike={() => handleLike()} />
								<DislikeButton onDislike={() => handleDislike()} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
