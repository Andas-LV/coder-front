"use client";

import { useState, useEffect, useCallback } from "react";

interface UseScrollToBottomProps {
	scrollContainer: HTMLElement | null;
	threshold?: number;
}

export const useScrollToBottom = ({
	scrollContainer,
	threshold = 100,
}: UseScrollToBottomProps) => {
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(true);

	useEffect(() => {
		if (!scrollContainer) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

			const atBottom = distanceFromBottom <= 10;
			const shouldShowButton = distanceFromBottom > threshold;

			setIsAtBottom(atBottom);
			setShowScrollButton(shouldShowButton);
		};

		scrollContainer.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => {
			scrollContainer.removeEventListener("scroll", handleScroll);
		};
	}, [scrollContainer, threshold]);

	const scrollToBottom = useCallback(
		(smooth = true) => {
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: smooth ? "smooth" : "auto",
				});
			}
		},
		[scrollContainer],
	);

	return {
		showScrollButton,
		isAtBottom,
		scrollToBottom,
	};
};
