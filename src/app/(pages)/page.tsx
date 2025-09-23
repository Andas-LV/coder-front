"use client";

import Header from "@/widgets/Header/Header";
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Bot, MessageSquare, Zap, Code } from "lucide-react";
import DarkVeil from "@/shared/components/backgrounds/DarkVeil";

export default function Home() {
	const features = [
		{
			icon: <MessageSquare className="h-6 w-6" />,
			title: "Множественные чаты",
			description:
				"Создавайте неограниченное количество чатов с разными ИИ моделями",
		},
		{
			icon: <Bot className="h-6 w-6" />,
			title: "Лучшие ИИ модели",
			description: "Доступ к GPT-4, Claude, Gemini и другим передовым моделям",
		},
		{
			icon: <Code className="h-6 w-6" />,
			title: "Помощь в коде",
			description:
				"Генерация, отладка и объяснение кода на любых языках программирования",
		},
		{
			icon: <Zap className="h-6 w-6" />,
			title: "Быстрые ответы",
			description: "Мгновенные ответы благодаря оптимизированной архитектуре",
		},
	];

	return (
		<div className="h-screen bg-gradient-to-br">
			<Header />

			<div className="relative w-full h-full bg-background">
				<div className="absolute inset-0 z-0">
					<DarkVeil />
				</div>

				<section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">Возможности платформы</h2>
						<p className="text-lg max-w-2xl mx-auto">
							Все что нужно для работы с ИИ в одном интерфейсе
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="border-0 shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
							>
								<CardHeader className="text-center pb-4">
									<div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
										{feature.icon}
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<CardDescription className="text-sm">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
