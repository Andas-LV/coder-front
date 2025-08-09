"use client";

import styles from "./ProfileInfoSkeleton.module.scss";

export default function ProfileInfoSkeleton() {
	return (
		<div className={styles.profileContainer}>
			<div className={styles.profileLayout}>
				{/* Photo Section Skeleton */}
				<div className={styles.photoSection}>
					<div className={styles.avatarContainer}>
						<div className={styles.avatarSkeleton} />
						<div className={styles.providerBadgeSkeleton} />
					</div>
					<div className={styles.userInfo}>
						<div className={styles.userNameSkeleton} />
						<div className={styles.userEmailSkeleton} />
					</div>
				</div>

				{/* Info Section Skeleton */}
				<div className={styles.infoSection}>
					<div className={styles.infoList}>
						{/* Info Item 1 - ID пользователя */}
						<div className={styles.infoItemSkeleton}>
							<div className={styles.infoIconSkeleton} />
							<div className={styles.infoContentSkeleton}>
								<div className={styles.infoLabelSkeleton} />
								<div
									className={`${styles.infoValueSkeleton} ${styles.medium}`}
								/>
							</div>
						</div>

						{/* Info Item 2 - Вход через */}
						<div className={styles.infoItemSkeleton}>
							<div className={styles.infoIconSkeleton} />
							<div className={styles.infoContentSkeleton}>
								<div className={styles.infoLabelSkeleton} />
								<div
									className={`${styles.infoValueSkeleton} ${styles.short}`}
								/>
							</div>
						</div>

						{/* Info Item 3 - Email */}
						<div className={styles.infoItemSkeleton}>
							<div className={styles.infoIconSkeleton} />
							<div className={styles.infoContentSkeleton}>
								<div className={styles.infoLabelSkeleton} />
								<div className={`${styles.infoValueSkeleton} ${styles.long}`} />
							</div>
						</div>

						{/* Info Item 4 - Последнее обновление */}
						<div className={styles.infoItemSkeleton}>
							<div className={styles.infoIconSkeleton} />
							<div className={styles.infoContentSkeleton}>
								<div className={styles.infoLabelSkeleton} />
								<div
									className={`${styles.infoValueSkeleton} ${styles.medium}`}
								/>
							</div>
						</div>

						{/* Logout Button Skeleton */}
						<div className={styles.logoutBtnSkeleton} />
					</div>
				</div>
			</div>
		</div>
	);
}
