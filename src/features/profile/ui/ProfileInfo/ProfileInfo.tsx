"use client";

import React, { JSX } from "react";
import { Mail, User, Calendar, LogOut } from "lucide-react";
import styles from "./ProfileInfo.module.scss";
import { getProviderIcon, getProviderName } from "@/shared/utils/authProviders";
import { formatDate } from "@/shared/utils/formatDate";
import { IProfile } from "@/entities/profile/types/profileTypes";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { routes } from "@/core/config/routes";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";

interface ProfileInfoProps {
	profile: IProfile;
}

interface InfoItem {
	icon: JSX.Element;
	label: string;
	value: string;
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut({ redirect: false });
			toast.success("Вы вышли из аккаунта", {
				position: "bottom-right",
			});
			router.push(routes.home());
		} catch (error) {
			console.error(error);
			toast.error("Что-то пошло не так", {
				position: "bottom-right",
			});
		}
	};

	const infoItems: InfoItem[] = [
		{
			icon: <User />,
			label: "ID пользователя",
			value: profile.id,
		},
		{
			icon: getProviderIcon(profile.provider),
			label: "Вход через",
			value: getProviderName(profile.provider),
		},
		{
			icon: <Mail />,
			label: "Email",
			value: profile.email,
		},
		{
			icon: <Calendar />,
			label: "Последнее обновление",
			value: formatDate(profile.updatedAt),
		},
	];

	return (
		<div className={styles.profileContainer}>
			<div className={styles.profileLayout}>
				<div className={styles.photoSection}>
					<div className={styles.avatarContainer}>
						<Avatar className={styles.avatar}>
							<AvatarImage src={profile.image} alt={profile.name} />
							<AvatarFallback>
								{profile.name.charAt(0).toUpperCase() || "CN"}
							</AvatarFallback>
						</Avatar>
						<div className={styles.providerBadge}>
							{getProviderIcon(profile.provider)}
						</div>
					</div>
					<div className={styles.userInfo}>
						<h2 className={styles.userName}>{profile.name}</h2>
						<p className={styles.userEmail}>{profile.email}</p>
					</div>
				</div>

				<div className={styles.infoSection}>
					<div className={styles.infoList}>
						{infoItems.map((item, index) => (
							<div key={index} className={styles.infoItem}>
								<div className={styles.infoIcon}>{item.icon}</div>
								<div className={styles.infoContent}>
									<span className={styles.infoLabel}>{item.label}</span>
									<span className={styles.infoValue}>{item.value}</span>
								</div>
							</div>
						))}

						<Button
							className={styles.logoutBtn}
							variant={"dark"}
							onClick={handleLogout}
						>
							<LogOut />
							<span>Выйти</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
