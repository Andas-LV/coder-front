import axios from "axios";
import { getErrorMessage } from "@/shared/api/errors";

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

/** Проверка до отправки — те же ограничения, что на сервере. */
export function validatePdf(file: File): string | null {
	const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
	if (!isPdf) return "Поддерживаются только PDF";
	if (file.size > MAX_UPLOAD_BYTES) return "Файл больше 20 МБ";
	return null;
}

const NO_TEXT = "PDF has no extractable text";
const CORRUPTED = "Invalid or corrupted PDF";

/** Текст ошибки отправки сообщения с файлами для пользователя. */
export function getUploadErrorMessage(err: unknown): string {
	if (axios.isAxiosError(err)) {
		const status = err.response?.status;
		if (status === 413) return "Файл больше 20 МБ";
		if (status === 415) return "Поддерживаются только PDF";
		if (status === 422) {
			const detail = getErrorMessage(err);
			if (detail === NO_TEXT) return "В PDF нет текста (похоже на скан)";
			if (detail === CORRUPTED) return "PDF повреждён или не читается";
			return detail;
		}
	}
	return getErrorMessage(err, "Не удалось загрузить файл");
}
