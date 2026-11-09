import type { ComponentType, CSSProperties } from "react";
import { Brain, Sparkles } from "lucide-react";
import { SiGoogle, SiNvidia, SiOpenai } from "react-icons/si";

type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

export interface ModelInfo {
	/** Исходное имя модели, как его отдаёт бэкенд (`gpt-oss:120b`). */
	id: string;
	name: string;
	company: string;
	color: string;
	icon: IconComponent;
	description: string;
	features: string[];
}

interface ModelFamily {
	prefix: string;
	company: string;
	color: string;
	icon: IconComponent;
	description: string;
	features: string[];
}

const FAMILIES: ModelFamily[] = [
	{
		prefix: "gemma",
		company: "Google",
		color: "#4285f4",
		icon: SiGoogle,
		description: "Открытая модель Google на базе исследований Gemini",
		features: ["Программирование", "Рассуждения", "Длинный контекст"],
	},
	{
		prefix: "nemotron",
		company: "NVIDIA",
		color: "#76b900",
		icon: SiNvidia,
		description: "Семейство моделей NVIDIA, оптимизированных для агентных задач",
		features: ["Рассуждения", "Инструменты", "Программирование"],
	},
	{
		prefix: "gpt-oss",
		company: "OpenAI",
		color: "#10a37f",
		icon: SiOpenai,
		description: "Open-weight модель OpenAI с цепочкой рассуждений",
		features: ["Рассуждения", "Программирование", "Математика"],
	},
	{
		prefix: "deepseek",
		company: "DeepSeek",
		color: "#6366f1",
		icon: Brain,
		description: "Продвинутая модель для рассуждений и кода",
		features: ["Логика", "Математика", "Программирование"],
	},
];

const FALLBACK: Omit<ModelFamily, "prefix"> = {
	company: "Ollama",
	color: "#64748b",
	icon: Sparkles,
	description: "Модель, доступная через Ollama Cloud",
	features: [],
};

/** Никогда не возвращает undefined: неизвестная модель получает запасной вариант. */
export function getModelInfo(model: string | null | undefined): ModelInfo {
	const id = model ?? "";
	const family = FAMILIES.find((f) => id.toLowerCase().startsWith(f.prefix));
	const f = family ?? FALLBACK;

	return {
		id,
		name: id || "Модель по умолчанию",
		company: f.company,
		color: f.color,
		icon: f.icon,
		description: f.description,
		features: f.features,
	};
}
