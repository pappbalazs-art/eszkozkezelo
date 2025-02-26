import { Dispatch, useEffect, useState } from "react";

import { database } from "@/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export default function EditCategoryModal({
	isOpen,
	onOpen,
	onOpenChange,
	selectedCategory,
	updateCategories,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	selectedCategory: any;
	updateCategories: Function;
}) {
	const [name, setName] = useState(selectedCategory.name);

	const handleEditCategory = async () => {
		await updateDoc(doc(database, "categories", selectedCategory.id), {
			name: name,
		});
		await updateCategories();

		onOpenChange();
	};

	useEffect(() => {
		setName(selectedCategory.name);
	}, [selectedCategory, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose: any) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Kategória szerkesztése
						</ModalHeader>
						<ModalBody>
							<Input
								label="Név"
								variant="bordered"
								isRequired
								value={name}
								onValueChange={setName}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="flat"
								onPress={() => {
									setName("");
									onClose();
								}}
							>
								Mégse
							</Button>
							<Button
								color="primary"
								onPress={handleEditCategory}
								isDisabled={
									name === "" ||
									name === selectedCategory.name
								}
							>
								Mentés
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
