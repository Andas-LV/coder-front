import { create } from "zustand";
import { fetchModels } from "../service/models.service";
import { getErrorMessage } from "@/shared/api/errors";

interface ModelsState {
	models: string[];
	defaultModel: string | null;
	loaded: boolean;
	loading: boolean;
	error: string | null;
	/** Загружает список один раз; повторные вызовы — no-op (кэш живёт в сторе). */
	load: (force?: boolean) => Promise<void>;
}

let inflight: Promise<void> | null = null;

export const useModelsStore = create<ModelsState>((set, get) => ({
	models: [],
	defaultModel: null,
	loaded: false,
	loading: false,
	error: null,

	load: async (force = false) => {
		if (get().loaded && !force) return;
		if (inflight) return inflight;

		set({ loading: true, error: null });
		inflight = (async () => {
			try {
				const { models, default: def } = await fetchModels(force);
				set({ models, defaultModel: def, loaded: true, loading: false });
			} catch (err) {
				set({ error: getErrorMessage(err), loading: false });
			} finally {
				inflight = null;
			}
		})();
		return inflight;
	},
}));
