"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./DesktopHeader.module.scss";

import { AuthSection } from "@/widgets/Header/AuthSection/AuthSection";
import { routes } from "@/core/config/routes";
import { useSession } from "next-auth/react";

export default function DesktopHeader() {
	const { data: session, status } = useSession();
	const pathname = usePathname();

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	const navItems = [
		{ href: routes.chats(), label: "Чаты" },
		{ href: routes.home(), label: "Цены" },
		{ href: routes.resources(), label: "ИИ-модели" },
	];

	return (
		<>
			<div className={styles.logo}>
				<Link href={routes.home()}>Coder</Link>
			</div>

			<div className={styles.rightBlock}>
				<nav className={styles.nav}>
					{navItems.map(({ href, label }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								className={`${styles.navLink} ${isActive ? styles.active : ""}`}
							>
								{label}
							</Link>
						);
					})}
				</nav>

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
