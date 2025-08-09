import { create } from "zustand";
import * as service from "@/entities/profile/service/profile.service";
import type { IProfile } from "@/entities/profile/types/profileTypes";

interface ProfileState {
	profile: IProfile | null;
	loading: boolean;
	error: string | null;
	getProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
	profile: null,
	loading: false,
	error: null,

	getProfile: async () => {
		set({ loading: true, error: null });
		try {
			const result = await service.fetchProfile();
			set({ profile: result, loading: false });
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},
}));
