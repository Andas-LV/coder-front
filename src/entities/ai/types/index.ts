import { AiTypes } from "@/shared/types/AiTypes";

export interface AiRequest {
	chatId: string;
	prompt: string;
	aiProvider: AiTypes;
}

export interface AiResponse {
	result: string;
}
