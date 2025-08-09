"use client";

import { X, Edit, FileCode } from "lucide-react";
import styles from "./CodeFilePreview.module.scss";
import { getLanguageColor } from "@/features/chat/const/language";
import { CodeFile } from "@/features/chat/ui/CodeFile/types";

interface CodeFilePreviewProps {
	files: CodeFile[];
	onRemove: (id: string) => void;
	onEdit: (file: CodeFile) => void;
}

export const CodeFilePreview = ({
	files,
	onRemove,
	onEdit,
}: CodeFilePreviewProps) => {
	if (files.length === 0) return null;

	return (
		<div className={styles.container}>
			<div className={styles.header}>Файлы кода ({files.length}/5):</div>
			<div className={styles.filesGrid}>
				{files.map((file) => (
					<div key={file.id} className={styles.fileCard}>
						<div className={styles.cardHeader}>
							<div className={styles.headerContent}>
								<FileCode className={styles.fileIcon} />
								<span className={styles.fileName} title={file.name}>
									{file.name}
								</span>
								<span
									className={styles.languageBadge}
									style={{
										backgroundColor:
											getLanguageColor(file?.language) ?? "var(--color-accent)",
									}}
								>
									{file.language}
								</span>
							</div>
						</div>
						<div className={styles.cardContent}>
							<div className={styles.codePreview}>
								{file.content.slice(0, 100)}
								{file.content.length > 100 && "..."}
							</div>
							<div className={styles.actions}>
								<button
									className={`${styles.actionButton} ${styles.editButton}`}
									onClick={() => onEdit(file)}
									title="Редактировать файл"
								>
									<Edit className={styles.actionIcon} />
								</button>
								<button
									className={`${styles.actionButton} ${styles.deleteButton}`}
									onClick={() => onRemove(file.id)}
									title="Удалить файл"
								>
									<X className={styles.actionIcon} />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
