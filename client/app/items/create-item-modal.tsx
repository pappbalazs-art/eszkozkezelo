import { ChangeEvent, Dispatch, useEffect, useState } from "react";

import { database } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
import { Selection } from "@react-types/shared";

export default function CreateItemModal({
	isOpen,
	onOpen,
	onOpenChange,
	updateItems,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	updateItems: Function;
}) {
	const [name, setName] = useState("");
	const [serialNumber, setSerialNumber] = useState("");
	const [category, setCategory] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [categoryList, setCategoryList] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	const handleCategorySelection = (e: ChangeEvent<HTMLSelectElement>) => {
		setCategory(e.target.value);
	};

	const handleCreateItem = async () => {
		await addDoc(collection(database, "items"), {
			name: name,
			serial_number: serialNumber || "–",
			category_uid: category,
			description: description,
		});
		await updateItems();

		setName("");
		setSerialNumber("");
		setCategory("");
		setDescription("");

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
								Új eszköz hozzáadása
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
									onPress={handleCreateItem}
									isDisabled={!(name && category)}
								>
									Hozzáadás
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		)
	);
}
