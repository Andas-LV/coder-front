"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/shared/components/ui/drawer";
import { cn } from "@/shared/lib/utils";
import useIsMobile from "@/shared/hooks/useIsMobile";

interface ModalLayoutProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export function ModalLayout({
	open,
	onOpenChange,
	title,
	description,
	children,
	footer,
	className,
}: ModalLayoutProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				<DrawerContent className={cn("max-h-[90vh] flex flex-col", className)}>
					<DrawerHeader className="text-left">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					<div className="flex-1 overflow-y-auto px-4 py-2">{children}</div>
					<DrawerFooter className="pt-2">
						{footer}
						<DrawerClose asChild>
							<Button variant="outline">Отмена</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={cn("sm:max-w-[425px]", className)}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className="py-4" onClick={(e) => e.stopPropagation()}>
					{children}
				</div>
				<DialogFooter>{footer}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
