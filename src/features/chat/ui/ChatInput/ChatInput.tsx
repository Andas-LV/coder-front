"use client";

import { useRef, useState } from "react";
import type React from "react";
import { toast } from "sonner";
import { FileText, FileUp, Mic, Paperclip, Send, Square, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useEnterSubmit } from "@/shared/hooks/hotkeys/useEnterSubmit";
import { useAiStore, validatePdf } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import styles from "./ChatInput.module.scss";

const MAX_FILES = 5;

const formatSize = (bytes: number) =>
	bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} КБ` : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;

const sameFile = (a: File, b: File) =>
	a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

export const ChatInput = () => {
	const { loading, sendReqToAi, stop } = useAiStore();
	const { chatById } = useChatsStore();
	const [message, setMessage] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [dragging, setDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	// dragenter/dragleave срабатывают и на дочерних элементах — считаем глубину
	const dragDepth = useRef(0);

	const canSend = !!message.trim() && !loading;

	const addFiles = (list: FileList | File[]) => {
		const next = [...files];
		for (const file of Array.from(list)) {
			const error = validatePdf(file);
			if (error) {
				toast.error(`${file.name}: ${error}`);
				continue;
			}
			if (next.some((f) => sameFile(f, file))) continue;
			if (next.length >= MAX_FILES) {
				toast.error(`Не больше ${MAX_FILES} файлов в одном сообщении`);
				break;
			}
			next.push(file);
		}
		setFiles(next);
	};

	const removeFile = (file: File) => setFiles((prev) => prev.filter((f) => f !== file));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!canSend || !chatById) return;

		const content = message.trim();
		const filesToSend = files;
		setMessage("");
		setFiles([]);

		const result = await sendReqToAi({ chatId: chatById.id, content, files: filesToSend });

		if (result === "rejected") {
			// сервер отклонил до начала ответа (битый PDF, скан, размер…) — возвращаем всё в поле
			setMessage(content);
			setFiles(filesToSend);
			toast.error(useAiStore.getState().error ?? "Не удалось отправить сообщение");
		}
	};

	const { handleKeyDown } = useEnterSubmit({
		onSubmit: handleSubmit,
		disabled: loading,
		shouldSubmit: !!message.trim(),
	});

	const dragHandlers = {
		onDragEnter: (e: React.DragEvent) => {
			if (!e.dataTransfer.types.includes("Files")) return;
			e.preventDefault();
			dragDepth.current += 1;
			setDragging(true);
		},
		onDragOver: (e: React.DragEvent) => {
			if (e.dataTransfer.types.includes("Files")) e.preventDefault();
		},
		onDragLeave: () => {
			dragDepth.current = Math.max(0, dragDepth.current - 1);
			if (dragDepth.current === 0) setDragging(false);
		},
		onDrop: (e: React.DragEvent) => {
			e.preventDefault();
			dragDepth.current = 0;
			setDragging(false);
			if (!loading) addFiles(e.dataTransfer.files);
		},
	};

	if (!chatById) return null;

	return (
		<div className={`${styles.chatInput} ${dragging ? styles.dragging : ""}`} {...dragHandlers}>
			{dragging && (
				<div className={styles.dropOverlay}>
					<FileUp />
					Отпустите, чтобы прикрепить PDF
				</div>
			)}

			{files.length > 0 && (
				<div className={styles.files}>
					{files.map((file) => (
						<span key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.fileChip}>
							<FileText className={styles.fileIcon} />
							<span className={styles.fileName} title={file.name}>
								{file.name}
							</span>
							<span className={styles.fileSize}>{formatSize(file.size)}</span>
							<button
								type="button"
								className={styles.fileRemove}
								onClick={() => removeFile(file)}
								disabled={loading}
								aria-label={`Убрать ${file.name}`}
							>
								<X />
							</button>
						</span>
					))}
				</div>
			)}

			<form onSubmit={handleSubmit} className={styles.inputForm}>
				<div className={styles.inputContainer}>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={styles.attachButton}
						onClick={() => fileInputRef.current?.click()}
						disabled={loading || files.length >= MAX_FILES}
						title={
							files.length >= MAX_FILES
								? `Максимум ${MAX_FILES} файлов`
								: "Прикрепить PDF (до 20 МБ) или перетащите файл сюда"
						}
					>
						<Paperclip className={styles.inputIcon} />
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept="application/pdf,.pdf"
						multiple
						hidden
						onChange={(e) => {
							if (e.target.files) addFiles(e.target.files);
							e.target.value = ""; // позволяет выбрать тот же файл снова
						}}
					/>

					<Textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={
							files.length > 0
								? "Что сделать с файлом? Например: проверь резюме и укажи слабые места"
								: "Введите сообщение или перетащите PDF..."
						}
						className={styles.messageInput}
						rows={1}
						disabled={loading}
					/>

					<Button type="button" variant="ghost" size="icon" className={styles.voiceButton}>
						<Mic className={styles.inputIcon} />
					</Button>

					{loading ? (
						<Button
							type="button"
							onClick={stop}
							className={styles.sendButton}
							title="Остановить генерацию"
						>
							<Square className={styles.sendIcon} />
						</Button>
					) : (
						<Button
							type="submit"
							disabled={!canSend}
							className={styles.sendButton}
							title={files.length && !message.trim() ? "Напишите, что сделать с файлом" : undefined}
						>
							<Send className={styles.sendIcon} />
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};
