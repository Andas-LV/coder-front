"use client";

import styles from "./page.module.scss";
import Header from "@/widgets/Header/Header";
import React from "react";

export default function Home() {
	return (
		<div className={styles.container}>
			<Header />
		</div>
	);
}
