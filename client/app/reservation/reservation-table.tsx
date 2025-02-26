import ItemDetailsModal from "@/app/items/item-details-modal";
import {
	ChevronDownIcon,
	SearchIcon,
	VerticalDotsIcon,
} from "@/components/icons";
import { database } from "@/firebase";
import { Button } from "@heroui/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/table";
import { useDisclosure } from "@heroui/use-disclosure";
import { Selection, SortDescriptor } from "@react-types/shared";
import {
	collection,
	documentId,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";

export const columns = [
	{ name: "NÉV", uid: "name", sortable: true },
	{ name: "KATEGÓRIA", uid: "category_uid", sortable: true },
	{ name: "AKCIÓK", uid: "actions" },
];

export default function ReservationTable({
	itemIDs,
	selectedItems,
	setSelectedItems,
}: {
	itemIDs: any;
	selectedItems: Selection;
	setSelectedItems: Dispatch<any>;
}) {
	const [items, setItems] = useState<any>([]);
	const [categories, setCategories] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [selectedItem, setSelectedItem] = useState(null);

	const itemDetailsModalDisclosure = useDisclosure();

	const [filterValue, setFilterValue] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<Selection>("all");
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "name",
		direction: "ascending",
	});

	const hasSearchFilter = Boolean(filterValue);

	const filteredItems = useMemo(() => {
		let filteredItems = [...items];

		if (hasSearchFilter) {
			filteredItems = filteredItems.filter((item) =>
				item.name
					.toLowerCase()
					.includes(filterValue.toLocaleLowerCase())
			);
		}

		if (
			categoryFilter !== "all" &&
			Array.from(categoryFilter).length !== categories.length
		) {
			filteredItems = filteredItems.filter((item) =>
				Array.from(categoryFilter).includes(item.category_uid)
			);
		}

		return filteredItems;
	}, [items, filterValue, categoryFilter]);

	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a: any, b: any) => {
			const first = a[sortDescriptor.column as keyof any] as number;
			const second = b[sortDescriptor.column as keyof any] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, filteredItems]);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue("");
	}, []);

	useEffect(() => {
		const updateItems = async () => {
			const itemsRef = collection(database, "items");

			// Get the items in batches because of the limitations of maximum 30 items if you are using an IN comparison.
			const itemBatches = [];
			const itemIds = itemIDs.slice(0);

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

			const categoriesSnapshot = await getDocs(
				collection(database, "categories")
			);

			setCategories(
				categoriesSnapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
			setItems(itemBatches.flat());
			setLoading(false);
		};

		updateItems();
	});

	const renderCell = useCallback(
		(item: any, columnKey: React.Key) => {
			const cellValue = item[columnKey as keyof any];

			switch (columnKey) {
				case "name":
					return <p className="font-bold">{cellValue}</p>;
				case "category_uid":
					return categories.filter(
						(category: any) => category.id === item.category_uid
					)[0].name;
				case "actions":
					return (
						<div className="relative flex justify-end items-center gap-2">
							<Dropdown>
								<DropdownTrigger>
									<Button
										isIconOnly
										size="sm"
										variant="light"
									>
										<VerticalDotsIcon className="text-default-300" />
									</Button>
								</DropdownTrigger>
								<DropdownMenu variant="flat">
									<DropdownItem
										key="details"
										onPress={() => {
											setSelectedItem(item);
											itemDetailsModalDisclosure.onOpen();
										}}
									>
										Részletek
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					);
				default:
					return cellValue;
			}
		},
		[categories]
	);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Keresés név alapján..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>

					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat"
								>
									Kategória
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								closeOnSelect={false}
								selectedKeys={categoryFilter}
								selectionMode="multiple"
								onSelectionChange={setCategoryFilter}
							>
								{categories.map((category: any) => (
									<DropdownItem
										key={category.id}
										className="capitalize"
									>
										{category.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}, [
		filterValue,
		categories,
		categoryFilter,
		onSearchChange,
		hasSearchFilter,
	]);

	return (
		<>
			<ItemDetailsModal
				isOpen={itemDetailsModalDisclosure.isOpen}
				onOpen={itemDetailsModalDisclosure.onOpen}
				onOpenChange={itemDetailsModalDisclosure.onOpenChange}
				selectedItem={selectedItem}
			/>

			<Table
				className="z-0"
				isStriped
				sortDescriptor={sortDescriptor}
				topContent={topContent}
				topContentPlacement="outside"
				onSortChange={setSortDescriptor}
				selectionMode="multiple"
				selectedKeys={selectedItems}
				onSelectionChange={setSelectedItems}
				removeWrapper
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === "actions" ? "end" : "start"}
							allowsSorting={column.sortable}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					isLoading={loading}
					loadingContent={<Spinner color="primary" />}
					emptyContent={"Nem található egyetlen eszköz sem..."}
					items={sortedItems}
				>
					{(item: any) => (
						<TableRow key={item.id}>
							{(columnKey) => (
								<TableCell>
									{renderCell(item, columnKey)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</>
	);
}
