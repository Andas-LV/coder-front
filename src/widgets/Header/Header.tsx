"use client";

import DesktopHeader from "./DesktopHeader/DesktopHeader";
import MobileHeader from "./MobileHeader/MobileHeader";
import styles from "./Header.module.scss";
import useIsMobile from "@/shared/hooks/useIsMobile";

export default function Header() {
	const isMobile = useIsMobile();

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				{isMobile ? (
					<div className={styles.mobileHeader}>
						<MobileHeader />
					</div>
				) : (
					<div className={styles.desktopHeader}>
						<DesktopHeader />
					</div>
				)}
			</div>
		</header>
	);
}
