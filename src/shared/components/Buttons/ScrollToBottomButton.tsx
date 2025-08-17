"use client";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ScrollToBottomButtonProps {
	scrollContainer: HTMLElement | null;
	className?: string;
}

export const ScrollToBottomButton = ({
	scrollContainer,
	className,
}: ScrollToBottomButtonProps) => {
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		if (!scrollContainer) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

			// Показываем кнопку если пользователь прокрутил выше чем на 100px от низа
			setShowButton(distanceFromBottom > 100);
		};

		scrollContainer.addEventListener("scroll", handleScroll);

		// Проверяем начальное состояние
		handleScroll();

		return () => {
			scrollContainer.removeEventListener("scroll", handleScroll);
		};
	}, [scrollContainer]);

	const scrollToBottom = () => {
		if (scrollContainer) {
			scrollContainer.scrollTo({
				top: scrollContainer.scrollHeight,
				behavior: "smooth",
			});
		}
	};

	if (!showButton) return null;

	return (
		<Button
			onClick={scrollToBottom}
			size="icon"
			className={cn(
				"fixed bottom-10 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-50",
				"bg-[#fff] hover:bg-[#fff]/90 text-primary-foreground",
				"rounded-2xl shadow-lg border border-border/20",
				"transition-all duration-200 ease-in-out",
				"animate-in slide-in-from-bottom-2",
				className,
			)}
			aria-label="Прокрутить к последнему сообщению"
		>
			<ChevronDown />
		</Button>
	);
};
