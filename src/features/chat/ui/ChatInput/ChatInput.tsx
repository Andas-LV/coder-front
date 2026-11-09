"use client";

import { useState } from "react";
import type React from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Send, Mic, FilePlus, Square } from "lucide-react";
import styles from "./ChatInput.module.scss";
import { useAiStore } from "@/entities/ai";
import { useChatsStore } from "@/entities/chats";
import { useEnterSubmit } from "@/shared/hooks/hotkeys/useEnterSubmit";
import { CodeFileModal } from "../CodeFile/CodeFileModal";
import { CodeFilePreview } from "../CodeFile/CodeFilePreview/CodeFilePreview";
import { CodeFile } from "@/features/chat/ui/CodeFile/types";

export const ChatInput = () => {
	const { loading, sendReqToAi, stop } = useAiStore();
	const { chatById } = useChatsStore();
	const [message, setMessage] = useState("");
	const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
	const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
	const [editingFile, setEditingFile] = useState<CodeFile | null>(null);

	const canAddMoreFiles = codeFiles.length < 5;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!(message.trim() || codeFiles.length > 0) || loading || !chatById) return;

		const userMessage = message.trim();
		const filesToSend = [...codeFiles];

		setMessage("");
		setCodeFiles([]);

		let fullPrompt = userMessage;
		if (filesToSend.length > 0) {
			const codeContext = filesToSend
				.map(
					(file) =>
						`\n\n**${file.name}** (${file.language}):\n\`\`\`${file.language}\n${file.content}\n\`\`\``,
				)
				.join("");
			fullPrompt = userMessage + codeContext;
		}

		await sendReqToAi({ chatId: chatById.id, content: fullPrompt });
	};

	const { handleKeyDown } = useEnterSubmit({
		onSubmit: handleSubmit,
		disabled: loading,
		shouldSubmit: !!(message.trim() || codeFiles.length > 0),
	});

	const handleAddCodeFile = (file: CodeFile) => {
		if (editingFile) {
			setCodeFiles((prev) =>
				prev.map((f) => (f.id === editingFile.id ? file : f)),
			);
			setEditingFile(null);
		} else {
			setCodeFiles((prev) => [...prev, file]);
		}
	};

	const handleRemoveCodeFile = (id: string) => {
		setCodeFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const handleEditCodeFile = (file: CodeFile) => {
		setEditingFile(file);
		setIsCodeModalOpen(true);
	};

	const handleOpenCodeModal = () => {
		setEditingFile(null);
		setIsCodeModalOpen(true);
	};

	if (!chatById) return null;

	return (
		<div className={styles.chatInput}>
			<CodeFilePreview
				files={codeFiles}
				onRemove={handleRemoveCodeFile}
				onEdit={handleEditCodeFile}
			/>

			<form onSubmit={handleSubmit} className={styles.inputForm}>
				<div className={styles.inputContainer}>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={styles.attachButton}
						onClick={handleOpenCodeModal}
						disabled={!canAddMoreFiles || loading}
						title={
							canAddMoreFiles ? "Добавить файл кода" : "Максимум 5 файлов кода"
						}
					>
						<FilePlus className={styles.inputIcon} />
					</Button>

					<Textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={
							codeFiles.length > 0
								? "Опишите что нужно сделать с кодом..."
								: "Введите ваше сообщение..."
						}
						className={styles.messageInput}
						rows={1}
						disabled={loading}
					/>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						className={styles.voiceButton}
					>
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
							disabled={!(message.trim() || codeFiles.length > 0)}
							className={styles.sendButton}
						>
							<Send className={styles.sendIcon} />
						</Button>
					)}
				</div>
			</form>

			<CodeFileModal
				open={isCodeModalOpen}
				onOpenChange={setIsCodeModalOpen}
				onSave={handleAddCodeFile}
				editingFile={editingFile}
			/>
		</div>
	);
};
