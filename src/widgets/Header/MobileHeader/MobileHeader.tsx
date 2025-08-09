"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import styles from "./MobileHeader.module.scss";
import { AuthSection } from "@/widgets/Header/AuthSection/AuthSection";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { routes } from "@/core/config/routes";
import { Button } from "@/shared/components/ui/button";

export default function MobileHeader() {
	const { data: session, status } = useSession();

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant={"ghost"}
						className={styles.menuButton}
						aria-label="Открыть меню"
					>
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className={styles.sheetContent}>
					<SheetHeader className={styles.sheetHeader}>
						<SheetTitle>
							<div className={styles.logo}>
								<Link href={routes.home()}>Coder</Link>
							</div>
						</SheetTitle>
					</SheetHeader>
					<div className={styles.mobileNav}>
						<Link href={routes.chats()} className={styles.mobileNavItem}>
							Чаты
						</Link>
						<Link href={routes.home()} className={styles.mobileNavItem}>
							Цены
						</Link>
						<Link href={routes.resources()} className={styles.mobileNavItem}>
							ИИ-модели
						</Link>
						<Link href={routes.home()} className={styles.mobileNavItem}>
							Стэки
						</Link>
					</div>
				</SheetContent>
			</Sheet>

			<div className={styles.mobileActions}>
				<AuthSection
					session={session}
					status={status}
					isDropdownOpen={isDropdownOpen}
					toggleDropdown={toggleDropdown}
				/>
			</div>
		</>
	);
}
