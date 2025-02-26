import { ChangeEvent, Dispatch, useEffect, useState } from "react";

import { database } from "@/firebase";
import {
	addDoc,
	collection,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

export default function EditItemModal({
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
	const [name, setName] = useState(selectedItem.name);
	const [serialNumber, setSerialNumber] = useState(
		selectedItem.serial_number
	);
	const [category, setCategory] = useState<string>(selectedItem.category_uid);
	const [description, setDescription] = useState<string>(
		selectedItem.description
	);
	const [categoryList, setCategoryList] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	const handleCategorySelection = (e: ChangeEvent<HTMLSelectElement>) => {
		setCategory(e.target.value);
	};

	const handleEditItem = async () => {
		await updateDoc(doc(database, "items", selectedItem.id), {
			name: name,
			serial_number: serialNumber,
			category_uid: category,
		});
		await updateItems();

		onOpenChange();
	};

	useEffect(() => {
		const fetchCategoryList = async () => {
			const snapshot = await getDocs(collection(database, "categories"));

			setCategoryList(
				snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
			setLoading(false);
		};

		fetchCategoryList();
	});

	useEffect(() => {
		setName(selectedItem.name);
		setSerialNumber(selectedItem.serial_number);
		setCategory(selectedItem.category_uid);
		setDescription(selectedItem.description);
	}, [selectedItem, isOpen]);

	return (
		!loading && (
			<Modal
				isOpen={isOpen}
				placement="top-center"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose: any) => (
						<>
							<ModalHeader className="flex flex-col gap-2">
								Eszköz szerkesztése
							</ModalHeader>
							<ModalBody>
								<Input
									label="Név"
									variant="bordered"
									isRequired
									value={name}
									onValueChange={setName}
								/>
								<Input
									label="Szériaszám"
									variant="bordered"
									value={serialNumber}
									onValueChange={setSerialNumber}
								/>
								<Select
									label="Kategória"
									placeholder="Válaszz egy kategóriát..."
									variant="bordered"
									isRequired
									selectedKeys={[category]}
									onChange={handleCategorySelection}
								>
									{categoryList.map((category: any) => (
										<SelectItem key={category.id}>
											{category.name}
										</SelectItem>
									))}
								</Select>
								<Textarea
									label="Leírás"
									variant="bordered"
									value={description}
									onValueChange={setDescription}
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
									onPress={handleEditItem}
									isDisabled={
										name === selectedItem.name &&
										serialNumber ===
											selectedItem.serial_number &&
										category ===
											selectedItem.category_uid &&
										description === selectedItem.description
									}
								>
									Mentés
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		)
	);
}
