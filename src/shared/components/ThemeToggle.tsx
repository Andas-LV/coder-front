"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Laptop, Moon, Sun, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ThemeOption = "light" | "dark" | "system";

export interface ThemeToggleProps {
	showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
	const { setTheme, resolvedTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const current = (
		mounted ? (theme === "system" ? "system" : resolvedTheme) : "system"
	) as ThemeOption;

	const options: {
		key: ThemeOption;
		label: string;
		icon: React.ComponentType<{ className?: string }>;
	}[] = [
		{ key: "light", label: "Светлая", icon: Sun },
		{ key: "dark", label: "Тёмная", icon: Moon },
		{ key: "system", label: "Система", icon: Laptop },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size={showLabel ? "default" : "icon"}
					aria-label="Переключатель темы"
				>
					{/* Animated icon switch */}
					<Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					{showLabel && (
						<span className="ml-2 hidden sm:inline">
							{mounted ? labelByKey(current) : "Тема"}
						</span>
					)}
					<span className="sr-only">Открыть выбор темы</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuLabel>Тема</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{options.map(({ key, label, icon: Icon }) => (
					<DropdownMenuItem
						key={key}
						onClick={() => setTheme(key)}
						className={cn("gap-2", mounted && current === key && "font-medium")}
						aria-checked={mounted && current === key}
						role="menuitemradio"
					>
						<Icon className="size-4" />
						<span>{label}</span>
						{mounted && current === key ? (
							<Check className="ml-auto size-4" />
						) : null}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function labelByKey(key: ThemeOption): string {
	switch (key) {
		case "light":
			return "Светлая";
		case "dark":
			return "Тёмная";
		default:
			return "Система";
	}
}
