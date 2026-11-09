import type { ISource } from "@/entities/chats";

/** Минимальная форма узла mdast — достаточно для обхода. */
interface MdNode {
	type: string;
	value?: string;
	url?: string;
	title?: string | null;
	children?: MdNode[];
}

// внутри кода и уже готовых ссылок [n] не трогаем
const SKIP = new Set(["code", "inlineCode", "link", "linkReference"]);
const CITATION = /(\[\d+\])/;

export const citationAnchor = (prefix: string, n: number) => `${prefix}${n}`;

/**
 * remark-плагин: превращает `[n]` в тексте ответа в ссылки на источник n.
 * Работает по mdast, поэтому `arr[1]` в коде остаётся как есть.
 */
export function remarkCitations(sources: ISource[], anchorPrefix: string) {
	const byN = new Map(sources.map((s) => [s.n, s]));

	const splitText = (value: string): MdNode[] =>
		value
			.split(CITATION)
			.filter(Boolean)
			.map((part) => {
				const n = Number(part.match(/^\[(\d+)\]$/)?.[1]);
				const src = byN.get(n);
				if (!src) return { type: "text", value: part };
				return {
					type: "link",
					url: `#${citationAnchor(anchorPrefix, n)}`,
					title: `${src.filename}, стр. ${src.page}`,
					children: [{ type: "text", value: `[${n}]` }],
				};
			});

	const walk = (node: MdNode) => {
		if (!node.children) return;
		node.children = node.children.flatMap((child) => {
			if (child.type === "text" && child.value) return splitText(child.value);
			if (!SKIP.has(child.type)) walk(child);
			return [child];
		});
	};

	return () => (tree: MdNode) => {
		if (byN.size) walk(tree);
	};
}

/** Номера источников, на которые есть ссылка `[n]` в тексте (без учёта кода). */
export function getCitedNumbers(text: string): Set<number> {
	const withoutCode = text.replace(/```[\s\S]*?(```|$)/g, "").replace(/`[^`]*`/g, "");
	return new Set(Array.from(withoutCode.matchAll(/\[(\d+)\]/g), (m) => Number(m[1])));
}
