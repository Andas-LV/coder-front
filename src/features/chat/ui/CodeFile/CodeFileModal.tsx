"use client"

import { useEffect, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { ModalLayout } from "@/shared/layouts/ModalLayout/ModalLayout";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { LANGUAGES } from "@/features/chat/const/language";
import { CodeFile } from "@/features/chat/ui/CodeFile/types";

interface CodeFileModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (file: CodeFile) => void
	editingFile?: CodeFile | null
}

export const CodeFileModal = ({ open, onOpenChange, onSave, editingFile }: CodeFileModalProps) => {
	const [name, setName] = useState("")
	const [content, setContent] = useState("")
	const [language, setLanguage] = useState("typescript")

	useEffect(() => {
		if (editingFile && editingFile.language) {
			setName(editingFile.name)
			setContent(editingFile.content)
			setLanguage(editingFile.language)
		} else {
			setName("")
			setContent("")
			setLanguage("typescript")
		}
	}, [editingFile])

	const handleSave = () => {
		if (!name.trim() || !content.trim()) return

		const file: CodeFile = {
			id: editingFile?.id || Date.now().toString(),
			name: name.trim(),
			content: content.trim(),
			language,
		}

		onSave(file)
		handleClose()
	}

	const handleClose = () => {
		setName("")
		setContent("")
		setLanguage("javascript")
		onOpenChange(false)
	}

	const footer = (
		<div className="flex gap-2 w-full">
			<Button onClick={handleSave} disabled={!name.trim() || !content.trim()} className="flex-1 text-white">
				{editingFile ? "Обновить" : "Добавить"}
			</Button>
		</div>
	)

	return (
		<ModalLayout
			open={open}
			onOpenChange={handleClose}
			title={editingFile ? "Редактировать файл кода" : "Добавить файл кода"}
			description="Добавьте код, который хотите отправить вместе с сообщением"
			footer={footer}
			className="sm:max-w-[600px]"
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="filename">Название файла</Label>
					<Input
						id="filename"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="например: main.js, utils.py, styles.css"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="language">Язык программирования</Label>
					<Select value={language} onValueChange={setLanguage}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<ScrollArea className="h-fit w-fit rounded-md">
								<div className="p-4">
									{LANGUAGES.map((lang) => (
										<SelectItem key={lang.value} value={lang.value}>
											{lang.label}
										</SelectItem>
									))}
								</div>
							</ScrollArea>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="code">Код</Label>
					<ScrollArea className={"h-[200px]"}>
						<Textarea
							id="code"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Вставьте ваш код здесь..."
							className="font-mono text-sm"
						/>
					</ScrollArea>
				</div>
			</div>
		</ModalLayout>
	)
}
