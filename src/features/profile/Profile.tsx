"use client";

import { useSession } from "next-auth/react";
import styles from "./profile.module.scss";
import { useProfileStore } from "@/entities/profile/store/useProfileStore";
import { useEffect } from "react";
import ProfileInfo from "@/features/profile/ui/ProfileInfo/ProfileInfo";
import ProfileInfoSkeleton from "@/features/profile/ui/ProfileInfoSkeleton/ProfileInfoSkeleton";

export default function Profile() {
	const { status } = useSession();
	const { profile, getProfile, loading } = useProfileStore();

	useEffect(() => {
		getProfile();
	}, [getProfile]);

	if (status === "loading" || loading) {
		return <ProfileInfoSkeleton />;
	}

	return (
		<>
			{profile && (
				<div className={styles.container}>
					<div className={styles.content}>
						<h1 className={styles.title}>Мой профиль</h1>
						<ProfileInfo profile={profile} />
					</div>
				</div>
			)}
		</>
	);
}
