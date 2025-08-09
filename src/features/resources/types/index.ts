import { AiTypes } from "@/shared/types/AiTypes";

export type IconType = "google" | "openai" | "meta" | "brain" | "sparkles";

export interface AIModelData {
	id: AiTypes;
	name: string;
	company: string;
	description: string;
	features: string[];
	iconType: IconType;
	color: string;
}
