import axiosInstance from "@/shared/api/axiosInstance";
import { AiRequest, AiResponse } from "@/entities/ai/types";

export async function sendMessageToAi(payload: AiRequest): Promise<AiResponse> {
	const { data } = await axiosInstance.post(
		`/ai/${payload.aiProvider}`,
		payload,
	);
	return data;
}
