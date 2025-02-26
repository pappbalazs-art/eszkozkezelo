import { Dispatch } from "react";

import { database } from "@/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";

export default function DeleteCategoryModal({
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
	const handleDeleteCategory = async () => {
		await deleteDoc(doc(database, "categories", selectedCategory.id));
		await updateCategories();

		onOpenChange();
	};

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
							Kategória törlése
						</ModalHeader>
						<ModalBody>
							<p>
								Biztos benne, hogy törli az alábbi kategóriát?
							</p>
							<p className="font-bold">{selectedCategory.name}</p>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="flat"
								onPress={handleDeleteCategory}
							>
								Törlés
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
