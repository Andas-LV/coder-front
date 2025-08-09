import React from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import styles from "./LoginCard.module.scss";
import { routes } from "@/core/config/routes";
import { getProviderIcon } from "@/shared/utils/authProviders";
import { toast } from "sonner";

export const LoginCard = () => {
	const handleSignIn = async (provider: string) => {
		try {
			await signIn(provider, { callbackUrl: routes.home(), redirect: true });
			toast.success("Вы успешно вошли в аккаунта", {
				position: "bottom-right",
			});
		} catch (e) {
			toast.success("Что-то пошло не так", {
				position: "bottom-right",
			});
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.header}>
					<h1 className={styles.title}>Добро пожаловать</h1>
					<p className={styles.subtitle}>Войдите в свой аккаунт</p>
				</div>

				<div className={styles.buttons}>
					<button
						className={`${styles.button} ${styles.googleButton}`}
						onClick={() => handleSignIn("google")}
					>
						{getProviderIcon("google")}
						<span>Войти через Google</span>
					</button>

					<button
						className={`${styles.button} ${styles.githubButton}`}
						onClick={() => handleSignIn("github")}
					>
						{getProviderIcon("github")}
						<span>Войти через GitHub</span>
					</button>
				</div>

				<div className={styles.footer}>
					<p>Нет аккаунта? Войдите через один из сервисов выше</p>
				</div>
			</div>
		</div>
	);
};
