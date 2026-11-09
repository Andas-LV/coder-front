import axiosInstance from "@/shared/api/axiosInstance";
import type { ModelsResponse } from "../types";

export async function fetchModels(refresh = false): Promise<ModelsResponse> {
	const { data } = await axiosInstance.get<ModelsResponse>("/models", {
		params: refresh ? { refresh: true } : undefined,
	});
	return data;
}
