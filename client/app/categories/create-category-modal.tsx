import { Dispatch, useState } from "react";

import { database } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function CreateCategoryModal({
	isOpen,
	onOpen,
	onOpenChange,
	updateCategories,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	updateCategories: Function;
}) {
	const [name, setName] = useState("");

	const handleCreateCategory = async () => {
		await addDoc(collection(database, "categories"), {
			name: name,
		});
		await updateCategories();
		setName("");

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
							Új kategória hozzáadása
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
								onPress={handleCreateCategory}
								isDisabled={name === ""}
							>
								Hozzáadás
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
