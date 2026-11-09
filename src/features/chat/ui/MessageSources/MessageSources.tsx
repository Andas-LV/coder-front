"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { ISource } from "@/entities/chats";
import { citationAnchor } from "@/features/chat/lib/citations";
import styles from "./MessageSources.module.scss";

interface Props {
	sources: ISource[];
	cited: Set<number>;
	anchorPrefix: string;
	/** открыть PDF на странице источника */
	onOpen: (source: ISource) => void;
}

type RowProps = Pick<Props, "anchorPrefix" | "onOpen"> & { source: ISource };

const SourceRow = ({ source, anchorPrefix, onOpen }: RowProps) => (
	<li id={citationAnchor(anchorPrefix, source.n)}>
		<button
			type="button"
			className={styles.source}
			title={`Открыть ${source.filename}, стр. ${source.page}`}
			onClick={() => onOpen(source)}
		>
			<span className={styles.n}>[{source.n}]</span>
			<FileText className={styles.icon} />
			<span className={styles.file}>{source.filename}</span>
			<span className={styles.meta}>
				стр. {source.page} · {Math.round(source.score * 100)}%
			</span>
		</button>
	</li>
);

/** Источники под ответом: процитированные видны, остальные свёрнуты. */
export const MessageSources = ({ sources, cited, anchorPrefix, onOpen }: Props) => {
	const [showAll, setShowAll] = useState(false);

	if (sources.length === 0) {
		return <p className={styles.empty}>В документах не нашлось подходящих фрагментов</p>;
	}

	// если модель не поставила ни одной ссылки — показываем все найденные
	const primary = cited.size ? sources.filter((s) => cited.has(s.n)) : sources;
	const rest = cited.size ? sources.filter((s) => !cited.has(s.n)) : [];

	return (
		<div className={styles.sources}>
			<span className={styles.title}>Источники</span>
			<ul className={styles.list}>
				{primary.map((s) => (
					<SourceRow key={s.n} source={s} anchorPrefix={anchorPrefix} onOpen={onOpen} />
				))}
				{showAll &&
					rest.map((s) => (
						<SourceRow key={s.n} source={s} anchorPrefix={anchorPrefix} onOpen={onOpen} />
					))}
			</ul>
			{rest.length > 0 && (
				<button type="button" className={styles.toggle} onClick={() => setShowAll((v) => !v)}>
					{showAll ? "Скрыть неиспользованные" : `Ещё найдено: ${rest.length}`}
				</button>
			)}
		</div>
	);
};
