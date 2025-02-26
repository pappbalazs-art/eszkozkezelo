import { database } from "@/firebase";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import {
	collection,
	documentId,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export default function ItemDetailsModal({
	isOpen,
	onOpen,
	onOpenChange,
	selectedItem,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	selectedItem: any;
}) {
	const [categoryName, setCategoryName] = useState("");
	const [loading, setLoading] = useState<boolean>(true);

	const getCategoryNameByUID = async (categoryUID: string) => {
		const categoriesRef = collection(database, "categories");
		const categoriesQuery = query(
			categoriesRef,
			where(documentId(), "==", categoryUID)
		);
		const categoriesSnapshot = await getDocs(categoriesQuery);

		return categoriesSnapshot.docs[0].data().name;
	};

	useEffect(() => {
		const fetchCategoryName = async () => {
			if (!(selectedItem && isOpen)) return;

			const categoriesRef = collection(database, "categories");
			const categoriesQuery = query(
				categoriesRef,
				where(documentId(), "==", selectedItem.category_uid)
			);
			const categoriesSnapshot = await getDocs(categoriesQuery);

			setCategoryName(categoriesSnapshot.docs[0].data().name);
			setLoading(false);
		};

		fetchCategoryName();
	}, [selectedItem, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onOpenChange}
			onClose={() => {
				setLoading(true);
			}}
		>
			{!loading && (
				<ModalContent>
					{(onClose: any) => (
						<>
							<ModalHeader className="flex flex-col gap-2">
								{selectedItem.name}
							</ModalHeader>
							<ModalBody className="mb-2">
								<div className="text-small">
									<span className="font-bold">
										Szériaszám:{" "}
									</span>
									{selectedItem.serial_number}
								</div>
								<div className="text-small">
									<span className="font-bold">
										Kategória:{" "}
									</span>
									{categoryName}
								</div>
								{selectedItem.description && (
									<div className="text-small">
										<span className="font-bold">
											Leírás:{" "}
										</span>
										<p className="whitespace-pre-wrap">
											{selectedItem.description}
										</p>
									</div>
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			)}
		</Modal>
	);
}
