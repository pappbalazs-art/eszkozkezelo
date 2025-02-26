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

export default function DeleteItemModal({
	isOpen,
	onOpen,
	onOpenChange,
	selectedItem,
	updateItems,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	selectedItem: any;
	updateItems: Function;
}) {
	const handleDeleteItem = async () => {
		await deleteDoc(doc(database, "items", selectedItem.id));
		await updateItems();

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
						<ModalHeader className="flex flex-col gap-2">
							Eszköz törlése
						</ModalHeader>
						<ModalBody>
							<p>Biztos benne, hogy törli az alábbi eszközt?</p>
							<p className="font-bold">{selectedItem.name}</p>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="flat"
								onPress={handleDeleteItem}
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
