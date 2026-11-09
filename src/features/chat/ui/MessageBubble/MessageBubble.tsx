"use client";

import { useMemo } from "react";
import { Paperclip } from "lucide-react";
import type React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import styles from "./MessageBubble.module.scss";
import sourcesStyles from "../MessageSources/MessageSources.module.scss";
import { Avatar } from "@/shared/components/Avatar/Avatar";
import {
	CopyButton,
	DislikeButton,
	LikeButton,
} from "@/shared/components/Buttons";
import { formatTimeOnly } from "@/shared/utils/formatDate";
import { IRequest } from "@/entities/chats";
import { getCitedNumbers, remarkCitations } from "@/features/chat/lib/citations";
import { MessageSources } from "../MessageSources/MessageSources";
import { useOpenPdf } from "../PdfViewer/usePdfViewer";

/** Клик по [n]: прокрутить к источнику и коротко подсветить его. */
const scrollToSource = (e: React.MouseEvent<HTMLAnchorElement>) => {
	e.preventDefault();
	const id = e.currentTarget.getAttribute("href")?.slice(1);
	const el = id && document.getElementById(id);
	if (!el) return;
	el.scrollIntoView({ behavior: "smooth", block: "nearest" });
	const flash = sourcesStyles.flash ?? "";
	el.classList.add(flash);
	setTimeout(() => el.classList.remove(flash), 1500);
};

const markdownComponents: Components = {
	a: ({ href, title, children }) =>
		href?.startsWith("#src-") ? (
			<sup>
				<a href={href} title={title} className={sourcesStyles.citation} onClick={scrollToSource}>
					{children}
				</a>
			</sup>
		) : (
			<a href={href} title={title} target="_blank" rel="noreferrer">
				{children}
			</a>
		),
};

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
	const openPdf = useOpenPdf();

	const handleLike = () => {
		console.log("Liked message:", request.responseId ?? request.id);
	};

	const handleDislike = () => {
		console.log("Disliked message:", request.responseId ?? request.id);
	};

	const meta = formatMeta(request);
	const { sources, response } = request;
	const anchorPrefix = `src-${request.id}-`;

	const remarkPlugins = useMemo(
		() => (sources?.length ? [remarkCitations(sources, anchorPrefix)] : []),
		[sources, anchorPrefix],
	);
	const cited = useMemo(() => getCitedNumbers(response), [response]);

	return (
		<div className={styles.messageContainer}>
			<div className={styles.userMessage}>
				<Avatar />

				<div className={styles.messageContent}>
					{!!request.attachments?.length && (
						<div className={styles.attachments}>
							{request.attachments.map((a, i) => (
								<button
									type="button"
									key={a.documentId || i}
									className={styles.attachment}
									title={a.documentId ? `Открыть ${a.filename}` : a.filename}
									// documentId пустой, пока сервер не принял файл
									disabled={!a.documentId}
									onClick={() => openPdf({ documentId: a.documentId, filename: a.filename })}
								>
									<Paperclip />
									<span className={styles.attachmentName}>{a.filename}</span>
									{a.pages != null && <span className={styles.attachmentMeta}>{a.pages} стр.</span>}
								</button>
							))}
						</div>
					)}
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
							<ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
								{response}
							</ReactMarkdown>

							{/* sources === null — чат без документов, ничего не показываем */}
							{sources && (
								<MessageSources
									sources={sources}
									cited={cited}
									anchorPrefix={anchorPrefix}
									onOpen={(s) =>
										openPdf({ documentId: s.documentId, filename: s.filename, page: s.page })
									}
								/>
							)}

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
