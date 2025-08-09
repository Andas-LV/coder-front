"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import styles from "./SearchInput.module.scss";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: Props) => {
	return (
		<div className={styles.searchContainer}>
			<div className={styles.searchWrapper}>
				<Search className={styles.searchIcon} />
				<Input
					placeholder="Поиск чатов..."
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={styles.searchInput}
				/>
			</div>
		</div>
	);
};
