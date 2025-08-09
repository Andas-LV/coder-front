"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
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
import styles from "./ThemeToggle.module.scss";

type ThemeOption = "light" | "dark" | "system";

interface ThemeOptions {
	key: ThemeOption;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

export function ThemeToggle() {
	const { setTheme, resolvedTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const current = (
		mounted ? (theme === "system" ? "system" : resolvedTheme) : "system"
	) as ThemeOption;

	const options: ThemeOptions[] = [
		{ key: "system", label: "Система", icon: Laptop },
		{ key: "light", label: "Светлая", icon: Sun },
		{ key: "dark", label: "Тёмная", icon: Moon },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={styles.dropdownItem}
					aria-label="Выбор темы"
				>
					<Moon className={styles.icon} />
					<span>Тема: {labelByKey(current)}</span>
				</button>
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
