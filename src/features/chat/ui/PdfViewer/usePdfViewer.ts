import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { fetchChatFileUrl, useChatsStore } from "@/entities/chats";
import { getErrorMessage } from "@/shared/api/errors";
import useIsMobile from "@/shared/hooks/useIsMobile";

export interface PdfTarget {
	documentId: string;
	filename: string;
	/** страница PDF, с 1 */
	page?: number;
}

/** Встроенный просмотрщик PDF понимает #page=N. */
export const withPage = (url: string, page?: number) => (page ? `${url}#page=${page}` : url);

function getFileErrorMessage(err: unknown): string {
	if (axios.isAxiosError(err)) {
		const status = err.response?.status;
		const detail = getErrorMessage(err);
		if (status === 404) {
			return /not stored/i.test(detail)
				? "Оригинал этого файла не сохранён — он был загружен до появления просмотра"
				: "Файл не найден";
		}
		if (status === 503) return detail || "Хранилище файлов недоступно";
	}
	return getErrorMessage(err, "Не удалось открыть файл");
}

interface PdfViewerState {
	target: PdfTarget | null;
	url: string | null;
	loading: boolean;
	error: string | null;

	/** newTab — сразу во вкладке браузера (мобильные не показывают PDF в iframe) */
	open: (chatId: string, target: PdfTarget, newTab?: boolean) => Promise<void>;
	close: () => void;
}

// защищает от ответа на уже закрытый/сменённый файл
let requestSeq = 0;

export const usePdfViewerStore = create<PdfViewerState>((set) => ({
	target: null,
	url: null,
	loading: false,
	error: null,

	open: async (chatId, target, newTab = false) => {
		if (newTab) {
			// окно открываем синхронно в обработчике клика — иначе его заблокирует браузер
			const win = window.open("about:blank", "_blank");
			try {
				const { url } = await fetchChatFileUrl(chatId, target.documentId);
				if (win) {
					win.opener = null;
					win.location.href = withPage(url, target.page);
				} else {
					window.location.href = withPage(url, target.page);
				}
			} catch (err) {
				win?.close();
				toast.error(getFileErrorMessage(err));
			}
			return;
		}

		const seq = ++requestSeq;
		set({ target, url: null, loading: true, error: null });
		try {
			const { url } = await fetchChatFileUrl(chatId, target.documentId);
			if (seq === requestSeq) set({ url, loading: false });
		} catch (err) {
			if (seq === requestSeq) set({ error: getFileErrorMessage(err), loading: false });
		}
	},

	close: () => {
		requestSeq++;
		set({ target: null, url: null, loading: false, error: null });
	},
}));

/** Открыть PDF текущего чата: на десктопе — в модалке, на мобильных — во вкладке. */
export function useOpenPdf() {
	const chatId = useChatsStore((s) => s.chatById?.id);
	const open = usePdfViewerStore((s) => s.open);
	const isMobile = useIsMobile();

	return (target: PdfTarget) => {
		if (chatId && target.documentId) open(chatId, target, isMobile);
	};
}
