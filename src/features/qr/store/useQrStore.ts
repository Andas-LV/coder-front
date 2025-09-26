import { create } from "zustand";
import * as service from "@/features/qr/service/qr.service";
import type { ICreatedQr, IApproveQr } from "@/features/qr/types/qrTypes";

interface QrState {
	createdQr: ICreatedQr | null;
	loading: boolean;
	error: string | null;
	getQr: () => Promise<void>;
}

export const useQrStore = create<QrState>((set) => ({
	createdQr: null,
	loading: false,
	error: null,

	getQr: async () => {
		set({ loading: true, error: null });
		try {
			const result = await service.createQr();
			set({ createdQr: result, loading: false });
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},
}));
