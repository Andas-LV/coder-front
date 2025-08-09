"use client";

import { Button } from "@/shared/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import styles from "./Buttons.module.scss";
import { toast } from "sonner";

interface CopyButtonProps {
	text: string;
	className?: string;
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success("Скопировано", {
				position: "top-center",
			});
		} catch (error) {
			console.error("Failed to copy text:", error);
			toast.error("Ошибка при копировании", {
				position: "top-center",
			});
		}
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={handleCopy}
			className={`${styles.actionButton} ${className || ""}`}
			title={copied ? "Скопировано!" : "Копировать"}
		>
			{copied ? (
				<Check className={styles.actionIcon} />
			) : (
				<Copy className={styles.actionIcon} />
			)}
		</Button>
	);
};
