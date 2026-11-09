"use client";

import { ExternalLink, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { usePdfViewerStore, withPage } from "./usePdfViewer";
import styles from "./PdfViewer.module.scss";

/** Просмотр PDF из чата. Один на страницу чата, открывается через useOpenPdf. */
export const PdfViewerModal = () => {
	const { target, url, loading, error, close } = usePdfViewerStore();
	const src = url && target ? withPage(url, target.page) : null;

	return (
		<Dialog open={!!target} onOpenChange={(open) => !open && close()}>
			<DialogContent showCloseButton={false} className={styles.modal}>
				<div className={styles.header}>
					<FileText className={styles.headerIcon} />
					<div className={styles.titleWrapper}>
						<DialogTitle className={styles.title} title={target?.filename}>
							{target?.filename}
						</DialogTitle>
						<DialogDescription className={styles.subtitle}>
							{target?.page ? `Страница ${target.page}` : "PDF-документ"}
						</DialogDescription>
					</div>

					<div className={styles.actions}>
						{src && (
							<Button variant="ghost" size="icon" asChild title="Открыть в новой вкладке">
								<a href={src} target="_blank" rel="noreferrer">
									<ExternalLink />
								</a>
							</Button>
						)}
						<DialogClose asChild>
							<Button variant="ghost" size="icon" title="Закрыть">
								<X />
							</Button>
						</DialogClose>
					</div>
				</div>

				<div className={styles.content}>
					{loading && (
						<div className={styles.state}>
							<Loader2 className={styles.spinner} />
							Загрузка файла...
						</div>
					)}
					{error && <div className={styles.state}>{error}</div>}
					{/* key — чтобы смена страницы того же файла перезагружала просмотрщик */}
					{src && <iframe key={src} src={src} title={target?.filename} className={styles.frame} />}
				</div>
			</DialogContent>
		</Dialog>
	);
};
