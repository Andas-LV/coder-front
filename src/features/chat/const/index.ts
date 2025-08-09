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
	chatgpt: {
		name: "ChatGPT",
		company: "OpenAI",
		color: "#10a37f",
		icon: SiOpenai,
		description: "Популярная языковая модель",
	},
	claude: {
		name: "Claude",
		company: "Anthropic",
		color: "#ff6b35",
		icon: Sparkles,
		description: "ИИ-ассистент с фокусом на безопасность",
	},
	llama: {
		name: "Llama",
		company: "Meta",
		color: "#1877f2",
		icon: SiMeta,
		description: "Открытая языковая модель",
	},
} as const;
