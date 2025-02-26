"use client";

import { database } from "@/firebase";
import getDateStringFromTimestamp from "@/utils/date-string-from-timestamp";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import {
	collection,
	doc,
	documentId,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ViewReservationModal({
	isOpen,
	onOpen,
	onOpenChange,
	selectedReservation,
}: {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	selectedReservation: any;
}) {
	const [user, setUser] = useState<any>(null);
	const [items, setItems] = useState<any>(null);
	const [categoryList, setCategoryList] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchCategoryList = async () => {
			const categoriesSnapshot = await getDocs(
				collection(database, "categories")
			);

			setCategoryList(
				categoriesSnapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
		};

		fetchCategoryList();
	});

	useEffect(() => {
		const fetchData = async () => {
			if (!(selectedReservation && isOpen)) return;

			const userRef = collection(database, "users");
			const itemsRef = collection(database, "items");

			const userQuery = query(
				userRef,
				where("user_uid", "==", selectedReservation.user_uid)
			);
			const userSnapshot = await getDocs(userQuery);

			// Get the items in batches because of the limitations of maximum 30 items if you are using an IN comparison.
			const itemBatches = [];
			const itemIds = selectedReservation.items.slice(0);

			while (itemIds.length > 0) {
				const batch = itemIds.splice(0, 30);

				const itemsQuery = query(
					itemsRef,
					where(documentId(), "in", [...batch])
				);
				const itemsSnapshot = await getDocs(itemsQuery);

				itemBatches.push(
					itemsSnapshot.docs.map((doc: any) => ({
						...doc.data(),
						id: doc.id,
					}))
				);
			}

			setUser(userSnapshot.docs[0].data());
			setItems(itemBatches.flat());
			setLoading(false);
		};

		fetchData();
	}, [selectedReservation, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			scrollBehavior="inside"
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
								{user.name}{" "}
								<span className="text-small">
									{getDateStringFromTimestamp(
										selectedReservation.from_timestamp
									)}
									{" – "}
									{getDateStringFromTimestamp(
										selectedReservation.to_timestamp
									)}
								</span>
							</ModalHeader>
							<ModalBody>
								<Accordion
									isCompact
									selectionMode="multiple"
									defaultExpandedKeys={"all"}
								>
									{categoryList.map((category: any) => {
										const itemsInCategory = items.filter(
											(item: any) =>
												item.category_uid ===
												category.id
										);

										if (itemsInCategory.length > 0) {
											return (
												<AccordionItem
													key={category.id}
													title={category.name}
												>
													{itemsInCategory.map(
														(item: any) => (
															<p
																key={item.id}
																className="text-small"
															>
																{item.name}
																{item.serial_number !==
																	"–" && (
																	<span className="px-1 text-xs text-gray-600">
																		(
																		{
																			item.serial_number
																		}
																		)
																	</span>
																)}
															</p>
														)
													)}
												</AccordionItem>
											);
										}
									})}
								</Accordion>
							</ModalBody>
						</>
					)}
				</ModalContent>
			)}
		</Modal>
	);
}
