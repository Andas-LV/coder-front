"use client";
import type React from "react";

interface UseEnterSubmitOptions {
	onSubmit: (e: React.FormEvent | React.KeyboardEvent) => void | Promise<void>;
	disabled?: boolean;
	shouldSubmit?: boolean;
}

export const useEnterSubmit = ({
	onSubmit,
	disabled = false,
	shouldSubmit = true,
}: UseEnterSubmitOptions) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (shouldSubmit) {
				onSubmit(e);
			}
		}
	};

	return { handleKeyDown };
};
