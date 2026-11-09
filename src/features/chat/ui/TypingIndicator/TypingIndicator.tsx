"use client";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import styles from "./TypingIndicator.module.scss";
import { getModelInfo } from "@/entities/models";
import type { IIndexingItem } from "@/entities/ai";

interface TypingIndicatorProps {
	model: string | null;
	/** пока приложенные PDF обрабатываются — показываем прогресс вместо точек */
	indexing?: IIndexingItem[] | null;
}

const IndexingRow = ({ item }: { item: IIndexingItem }) => {
	const percent = item.chunksTotal
		? Math.round((item.chunksDone / item.chunksTotal) * 100)
		: 0;
	// chunks_done = 0 — ждёт своей очереди (документы обрабатываются по одному)
	const label =
		item.status === "ready"
			? "готово"
			: item.chunksDone === 0
				? "в очереди"
				: `${percent}%`;

	return (
		<div className={styles.indexingRow}>
			<span className={styles.indexingText}>
				Обрабатываю <strong title={item.filename}>{item.filename}</strong>… {label}
			</span>
			<div className={styles.progress}>
				<div
					className={`${styles.bar} ${item.chunksDone === 0 ? styles.indeterminate : ""}`}
					style={{ width: `${item.status === "ready" ? 100 : percent}%` }}
				/>
			</div>
		</div>
	);
};

export const TypingIndicator = ({ model, indexing }: TypingIndicatorProps) => {
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
					{indexing?.length ? (
						<div className={styles.indexing}>
							{indexing.map((item) => (
								<IndexingRow key={item.documentId} item={item} />
							))}
						</div>
					) : (
						<div className={styles.typingDots}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
