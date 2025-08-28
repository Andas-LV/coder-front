import { Sparkles, Brain } from "lucide-react";
import { SiGoogle, SiOpenai, SiMeta } from "react-icons/si";

export const AI_INFO = {
	gemini: {
		name: "Gemini",
		company: "Google",
		color: "#4285f4",
		icon: SiGoogle,
		description: "Мультимодальная ИИ модель от Google",
	},
	deepseek: {
		name: "DeepSeek",
		company: "DeepSeek AI",
		color: "#6366f1",
		icon: Brain,
		description: "Продвинутая модель для рассуждений",
	},
} as const;
