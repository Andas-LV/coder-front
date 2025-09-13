import type { AIModelData } from "../types";

export const AI_MODELS_DATA: AIModelData[] = [
	{
		id: "gemini",
		name: "Gemini",
		company: "Google",
		description:
			"Модель 2.5-flash, ИИ от Google с продвинутыми рассуждениями о математике и программирований ",
		features: [
			"Мультимодальность",
			"Анализ изображений",
			"Программирование",
			"Длинный контекст",
		],
		iconType: "google",
		color: "#4285f4",
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		company: "DeepSeek AI",
		description:
			"Продвинутая языковая модель которая предназначена для задач, требующих логического мышления и самопроверки",
		features: [
			"Логические рассуждения",
			"Математика",
			"Программирование",
			"Анализ данных",
		],
		iconType: "brain",
		color: "#6366f1",
	},
	{
		id: "llama",
		name: "LLaMA",
		company: "Meta AI",
		description:
			"Семейство моделей от Meta, оптимизированное для генерации текста, анализа данных и диалоговых систем",
		features: [
			"Быстрая генерация текста",
			"Диалоговые системы",
			"Программирование",
			"Аналитика",
		],
		iconType: "meta",
		color: "#1d4ed8",
	},
];
