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

const formatMeta = (r: IRequest): string | null => {
	const parts: string[] = [];
	if (r.model) parts.push(r.model);
	if (r.inputTokens != null || r.outputTokens != null) {
		parts.push(`${r.inputTokens ?? 0}→${r.outputTokens ?? 0} ток.`);
	}
	if (r.latencyMs != null) parts.push(`${(r.latencyMs / 1000).toFixed(1)} с`);
	const cost = r.costUsd != null ? Number(r.costUsd) : NaN;
	if (!Number.isNaN(cost) && cost > 0) parts.push(`$${cost.toFixed(4)}`);
	return parts.length ? parts.join(" · ") : null;
};

export const MessageBubble = ({ request }: MessageBubbleProps) => {
	const handleLike = () => {
		console.log("Liked message:", request.responseId ?? request.id);
	};

	const handleDislike = () => {
		console.log("Disliked message:", request.responseId ?? request.id);
	};

	const meta = formatMeta(request);

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
						<div
							className={styles.messageText}
							style={request.error ? { borderColor: "var(--destructive)" } : undefined}
						>
							<ReactMarkdown>{request.response}</ReactMarkdown>

							<div className={styles.messageActions}>
								<CopyButton text={request.response} />
								{request.responseId && (
									<>
										<LikeButton onLike={handleLike} />
										<DislikeButton onDislike={handleDislike} />
									</>
								)}
								{meta && (
									<span className="ml-auto text-xs opacity-60">{meta}</span>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
