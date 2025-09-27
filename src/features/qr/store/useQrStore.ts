import { create } from "zustand";
import * as service from "@/features/qr/service/qr.service";
import type { ICreatedQr, IApproveQr } from "@/features/qr/types/qrTypes";
import { signIn } from "next-auth/react";

interface QrState {
	createdQr: ICreatedQr | null;
	loading: boolean;
	error: string | null;
	getQr: () => Promise<void>;
	approveQr: (payload: IApproveQr) => Promise<void>;
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

	approveQr: async (payload) => {
		set({ loading: true, error: null });
		try {
			const response = await service.approveQr(payload);

			console.log("[v0] Backend response:", response)

			if (response.type === "login") {
				const result = await signIn("credentials", {
					userData: JSON.stringify(response),
					redirect: false,
				})

				console.log("[v0] SignIn result:", result)

				if (result?.error) {
					throw new Error("Failed to create session: " + result.error)
				}

				// Сессия создана успешно
				console.log("[v0] Session created successfully")
			}
			set({ loading: false });
		} catch (err) {
			set({ error: (err as Error).message, loading: false });
		}
	},
}));
