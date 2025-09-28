import React, { useState } from "react";
import styles from "./AuthSection.module.scss";
import Link from "next/link";
import { LogOut, Settings, User, QrCodeIcon } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/core/config/routes";
import type { Session } from "next-auth";
import { Avatar } from "@/shared/components/Avatar/Avatar";
import { ThemeToggle } from "@/widgets/ThemeToggle/ThemeToggle";
import { isMobile } from "react-device-detect";
import { QrScanner } from "@/features/qr/ui/QrScanner";

interface AuthSectionProps {
	session: Session | null;
	status: "loading" | "authenticated" | "unauthenticated";
	isDropdownOpen: boolean;
	toggleDropdown: () => void;
}

export const AuthSection = ({
	session,
	status,
	isDropdownOpen,
	toggleDropdown,
}: AuthSectionProps) => {
	const router = useRouter();

	const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await signOut({ redirect: false });
			toast.success("Вы вышли из аккаунта", {
				position: "top-center",
			});
			router.push(routes.home());
		} catch (error) {
			console.error(error);
			toast.error("Что-то пошло не так", {
				position: "top-center",
			});
		}
	};

	return (
		<div className={styles.authSection}>
			{status === "loading" ? (
				<div className={styles.loadingAvatar} />
			) : session ? (
				<div style={{ position: "relative", alignItems: "center" }}>
					<button
						className={styles.avatarButton}
						onClick={toggleDropdown}
						aria-label="Открыть меню пользователя"
					>
						<Avatar />
					</button>

					<div
						className={`${styles.dropdown} ${!isDropdownOpen ? styles.hidden : ""}`}
					>
						<div className={styles.userInfo}>
							<div className={styles.userDetails}>
								{session.user?.name && (
									<p className={styles.userName}>{session.user.name}</p>
								)}
								{session.user?.email && (
									<p className={styles.userEmail}>{session.user.email}</p>
								)}
							</div>
						</div>
						<div className={styles.separator} />

						<div>
							<ThemeToggle />
						</div>

						<Link href={routes.profile()} className={styles.dropdownItem}>
							<User />
							<span>Профиль</span>
						</Link>

						<Link href="/" className={styles.dropdownItem}>
							<Settings />
							<span>Настройки</span>
						</Link>

						{isMobile && (
							<div
								onClick={() => setIsQRScannerOpen(true)}
								className={styles.dropdownItem}
							>
								<QrCodeIcon />
								<span>Сканировать QR</span>
							</div>
						)}

						<div className={styles.separator} />

						<button className={styles.dropdownItem} onClick={handleLogout}>
							<LogOut />
							<span>Выйти</span>
						</button>
					</div>
				</div>
			) : (
				<button className={styles.loginButton} onClick={() => signIn()}>
					<span className={styles.gradientBorder}></span>
					<span className={styles.buttonContent}>Войти</span>
				</button>
			)}

			{isQRScannerOpen && (
				<QrScanner onClose={() => setIsQRScannerOpen(false)} />
			)}
		</div>
	);
};
