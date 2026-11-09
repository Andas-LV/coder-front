import { create } from "zustand";
import * as service from "@/entities/profile/service/profile.service";
import type { IProfile } from "@/entities/profile/types/profileTypes";
import { getErrorMessage } from "@/shared/api/errors";

interface ProfileState {
	profile: IProfile | null;
	loading: boolean;
	error: string | null;
	/**
	 * Берёт профиль с бэкенда (GET /account/me). Если эндпоинта нет или он упал,
	 * используем `fallback` (данные из сессии NextAuth), чтобы страница работала.
	 */
	getProfile: (fallback?: IProfile | null) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
	profile: null,
	loading: false,
	error: null,

	getProfile: async (fallback) => {
		set({ loading: true, error: null });
		try {
			const result = await service.fetchProfile();
			set({ profile: { ...fallback, ...result }, loading: false });
		} catch (err) {
			set({
				profile: fallback ?? null,
				error: getErrorMessage(err),
				loading: false,
			});
		}
	},
}));
