"use client";

import React from "react";
import styles from "./Avatar.module.scss";
import {
	Avatar as AvatarShadcn,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { useSession } from "next-auth/react";

export const Avatar = () => {
	const { data: session } = useSession();

	return (
		<div className={styles.avatar}>
			<AvatarShadcn>
				<AvatarImage src={session?.user.image} alt="@shadcn" />
				<AvatarFallback>
					{session?.user?.name?.charAt(0).toUpperCase() || "CN"}
				</AvatarFallback>
			</AvatarShadcn>
		</div>
	);
};
