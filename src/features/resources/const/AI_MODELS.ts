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
		id: "chatgpt",
		name: "ChatGPT",
		company: "OpenAI",
		description:
			"Популярная языковая модель для общения, творчества и решения различных задач",
		features: ["Диалоги", "Творчество", "Обучение", "Помощь в работе"],
		iconType: "openai",
		color: "#10a37f",
	},
	{
		id: "claude",
		name: "Claude",
		company: "Anthropic",
		description:
			"ИИ-ассистент с акцентом на безопасность и полезность в различных задачах",
		features: ["Безопасность", "Анализ документов", "Творчество", "Этичность"],
		iconType: "sparkles",
		color: "#ff6b35",
	},
	{
		id: "llama",
		name: "Llama",
		company: "Meta",
		description:
			"Открытая языковая модель с возможностью локального развертывания",
		features: [
			"Open Source",
			"Локальное развертывание",
			"Кастомизация",
			"Исследования",
		],
		iconType: "meta",
		color: "#1877f2",
	},
];
