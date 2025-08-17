import React from "react";
import styles from "./TemplateName.module.scss";

interface TemplateNameProps {
	children: React.ReactNode;
}

export const TemplateName = ({children}: TemplateNameProps) => {
	return (
		<div className={styles.TemplateName}>
			<h1>TemplateName component</h1>
			{children}
		</div>
	);
};
