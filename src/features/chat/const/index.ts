import { Brain } from "lucide-react";
import { SiGoogle, SiMeta } from "react-icons/si";

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
	llama: {
		name: "Llama",
		company: "Meta",
		color: "#1d4ed8",
		icon: SiMeta,
		description:
			"Модель основана на архитектуре transformer, которая является типом рекуррентной нейронной сети (RNN) от Meta",
	},
} as const;
