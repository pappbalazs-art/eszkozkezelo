"use client";

import { Spacer } from "@heroui/spacer";
import ReserveTable from "./reserve-table";
import { useState } from "react";
import { Selection } from "@react-types/shared";
import {
	CalendarDate,
	DateValue,
	RangeCalendar,
	RangeValue,
} from "@heroui/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@heroui/button";
import {
	addDoc,
	collection,
	documentId,
	getDocs,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { useAuth } from "@/AuthContext";
import { database } from "@/firebase";
import getDateStringFromTimestamp from "@/utils/date-string-from-timestamp";
import { Textarea } from "@heroui/input";
import { sendForm } from "emailjs-com";
import axios from "axios";

export default function UsersPage() {
	const { user } = useAuth();

	const [dateRange, setDateRange] = useState<any>();
	const [fromTimestamp, setFromTimestamp] = useState<Timestamp>(
		new Timestamp(0, 0)
	);
	const [toTimestamp, setToTimestamp] = useState<Timestamp>(
		new Timestamp(0, 0)
	);
	const [selectedItems, setSelectedItems] = useState<Selection>(new Set([]));
	const [comment, setComment] = useState<string>("");
	const [categoryList, setCategoryList] = useState<any>([]);
	const [selectedItemsData, setSelectedItemsData] = useState<any>(null);

	const [step, setStep] = useState<any>("daterange");

	const fetchSelectedItemsData = async () => {
		const itemsRef = collection(database, "items");

		const categoriesSnapshot = await getDocs(
			collection(database, "categories")
		);

		// Get the items in batches because of the limitations of maximum 30 items if you are using an IN comparison.
		const itemBatches = [];
		const itemIds = Array.from(selectedItems);

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

		setCategoryList(
			categoriesSnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}))
		);
		setSelectedItemsData(itemBatches.flat());
	};

	const handleDateRangeChange = (value: RangeValue<DateValue>) => {
		setDateRange(value);
		setFromTimestamp(
			Timestamp.fromDate(
				new Date(
					value.start.year,
					value.start.month - 1,
					value.start.day
				)
			)
		);
		setToTimestamp(
			Timestamp.fromDate(
				new Date(value.end.year, value.end.month - 1, value.end.day)
			)
		);
	};

	const handleCreateReservation = async () => {
		// TO-DO: There needs to be something done if all the items are selected.
		// In that case the "selectedItems" value is "all". Maybe we should fetch all the items from the database and grab their IDs.
		// I don't think this will be the biggest priority, nobody would reserve all the eequipment, right?

		await addDoc(collection(database, "reservations"), {
			user_uid: user.user_uid,
			from_timestamp: fromTimestamp,
			to_timestamp: toTimestamp,
			status: "requested",
			items: Array.from(selectedItems),
			comment: comment,
		});

		const fetchParams = new FormData();
		fetchParams.append("email", "hello@pappbalazs.com");
		fetchParams.append("subject", "Megerősítés új foglalásról");
		fetchParams.append("message", "Sikeresen leadtál egy új foglalást!");

		const response = await fetch("https://pappbalazs.com/api/message", {
			method: "POST",
			mode: "no-cors",
			body: fetchParams,
		});

		console.log(response);
	};

	const renderCurrentStep = () => {
		switch (step) {
			case "daterange":
				return (
					<RangeCalendar
						aria-label="Foglalás időtartalma"
						visibleMonths={3}
						minValue={today(getLocalTimeZone())}
						value={dateRange}
						onChange={handleDateRangeChange}
					/>
				);
			case "item-selection":
				return (
					<ReserveTable
						selectedItems={selectedItems}
						setSelectedItems={setSelectedItems}
						fromTimestamp={fromTimestamp}
						toTimestamp={toTimestamp}
					/>
				);
			case "summary":
				return (
					<div className="flex flex-col">
						{categoryList.map((category: any) => {
							const itemsInCategory = selectedItemsData.filter(
								(item: any) => item.category_uid === category.id
							);

							if (itemsInCategory.length > 0) {
								return (
									<div className="py-2" key={category.id}>
										<p className="text-xl font-bold">
											{category.name}
										</p>

										{itemsInCategory.map((item: any) => (
											<p key={item.id}>{item.name}</p>
										))}
									</div>
								);
							}
						})}

						<Textarea
							label="Megjegyzés"
							variant="flat"
							value={comment}
							onValueChange={setComment}
						/>
					</div>
				);
			case "completed":
				return <p>Sikeres foglalás!</p>;
		}
	};

	const renderButtons = () => {
		switch (step) {
			case "daterange":
				return (
					<div className="flex justify-end">
						<Button
							color="primary"
							onPress={() => setStep("item-selection")}
							isDisabled={
								!(
									fromTimestamp.seconds !== 0 &&
									toTimestamp.seconds !== 0
								)
							}
						>
							Eszközök kiválasztása
						</Button>
					</div>
				);
			case "item-selection":
				return (
					<div className="flex justify-between">
						<Button
							color="primary"
							onPress={() => setStep("daterange")}
						>
							Vissza
						</Button>

						<Button
							color="primary"
							onPress={async () => {
								await fetchSelectedItemsData();
								setStep("summary");
							}}
							isDisabled={false}
						>
							Összegzés
						</Button>
					</div>
				);
			case "summary":
				return (
					<div className="flex justify-between">
						<Button
							color="primary"
							onPress={() => setStep("item-selection")}
						>
							Vissza
						</Button>

						<Button
							color="primary"
							onPress={() => {
								handleCreateReservation();
								setStep("completed");
							}}
							isDisabled={false}
						>
							Foglalás leadása
						</Button>
					</div>
				);
		}
	};

	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Új foglalás
			</h1>
			{fromTimestamp.seconds !== 0 && toTimestamp.seconds !== 0 && (
				<span className="text-lg px-3">
					{getDateStringFromTimestamp(fromTimestamp)}
					{" – "}
					{getDateStringFromTimestamp(toTimestamp)}
				</span>
			)}

			<Spacer y={5} />

			{renderCurrentStep()}

			<Spacer y={5} />

			{renderButtons()}
		</>
	);
}
