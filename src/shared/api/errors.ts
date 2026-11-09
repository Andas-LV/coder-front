import axios from "axios";

/** Достаёт человекочитаемое сообщение: FastAPI кладёт его в `detail`. */
export function getErrorMessage(err: unknown, fallback = "Произошла ошибка"): string {
	if (axios.isAxiosError(err)) {
		const detail = (err.response?.data as { detail?: unknown } | undefined)?.detail;
		if (typeof detail === "string") return detail;
		if (Array.isArray(detail) && detail.length) {
			// 422 от FastAPI: [{ loc, msg, type }]
			return detail
				.map((d) => (d && typeof d === "object" && "msg" in d ? String(d.msg) : String(d)))
				.join("; ");
		}
		return err.message || fallback;
	}
	return err instanceof Error ? err.message : fallback;
}

/** Отмена запроса: axios бросает CanceledError, чтение потока — DOMException AbortError. */
export function isAbortError(err: unknown): boolean {
	return axios.isCancel(err) || (err instanceof DOMException && err.name === "AbortError");
}

/**
 * Для запросов с responseType: "stream" тело ошибки тоже приходит потоком.
 * Дочитывает его, чтобы getErrorMessage увидел `detail`, и пробрасывает ошибку дальше.
 */
export async function rethrowStreamError(err: unknown): Promise<never> {
	if (axios.isAxiosError(err) && err.response?.data instanceof ReadableStream) {
		const text = await new Response(err.response.data).text().catch(() => "");
		try {
			err.response.data = JSON.parse(text);
		} catch {
			err.response.data = { detail: text || undefined };
		}
	}
	throw err;
}
