import {
	ChevronDownIcon,
	PlusIcon,
	SearchIcon,
	VerticalDotsIcon,
} from "@/components/icons";
import { database } from "@/firebase";
import IItem from "@/interfaces/item.i";
import { Button } from "@heroui/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
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
	and,
	collection,
	getDocs,
	or,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import {
	ChangeEvent,
	Dispatch,
	FormEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Pagination } from "@heroui/pagination";
import ItemDetailsModal from "../items/item-details-modal";

export const columns = [
	{ name: "NÉV", uid: "name", sortable: true },
	{ name: "KATEGÓRIA", uid: "category_uid", sortable: true },
	{ name: "AKCIÓK", uid: "actions" },
];

export default function ReserveTable({
	selectedItems,
	setSelectedItems,
	fromTimestamp,
	toTimestamp,
}: {
	selectedItems: Selection;
	setSelectedItems: Dispatch<any>;
	fromTimestamp: Timestamp;
	toTimestamp: Timestamp;
}) {
	const [items, setItems] = useState<any>([]);
	const [categories, setCategories] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [selectedItem, setSelectedItem] = useState(null);

	const itemDetailsModalDisclosure = useDisclosure();

	const [filterValue, setFilterValue] = useState("");
	const [disabledKeys, setDisabledKeys] = useState<string[]>([]);
	const [categoryFilter, setCategoryFilter] = useState<Selection>("all");
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "name",
		direction: "ascending",
	});

	const hasSearchFilter = Boolean(filterValue);

	const [page, setPage] = useState(1);

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

	const pages = Math.ceil(filteredItems.length / rowsPerPage);

	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a: any, b: any) => {
			const first = a[sortDescriptor.column as keyof any] as number;
			const second = b[sortDescriptor.column as keyof any] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, filteredItems]);

	const itemsOnPage = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return sortedItems.slice(start, end);
	}, [page, sortedItems, rowsPerPage]);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[]
	);

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
		const updateDisabledKeys = async () => {
			const reservationsRef = collection(database, "reservations");
			const reservationsQuery = query(
				reservationsRef,
				or(
					and(
						where("from_timestamp", "<=", fromTimestamp),
						where("to_timestamp", ">=", toTimestamp)
					),
					and(
						where("from_timestamp", ">=", fromTimestamp),
						where("to_timestamp", ">=", toTimestamp),
						where("from_timestamp", "<=", toTimestamp)
					),
					and(
						where("from_timestamp", "<=", fromTimestamp),
						where("to_timestamp", "<=", toTimestamp),
						where("to_timestamp", ">=", fromTimestamp)
					)
				)
			);
			const reservationsSnapshot = await getDocs(reservationsQuery);

			const disabledKeysArray: string[] = [];

			reservationsSnapshot.docs.map((doc) => {
				const data = doc.data();

				if (["completed", "declined"].includes(data.status)) return;

				data.items.map((item: string) => {
					if (disabledKeysArray.includes(item)) return;

					disabledKeysArray.push(item);
				});
			});

			setDisabledKeys(disabledKeysArray);
			setSelectedItems(
				new Set(selectedItems).difference(new Set(disabledKeysArray))
			);
		};

		if (!(fromTimestamp.seconds !== 0 && toTimestamp.seconds !== 0)) {
			return;
		}

		updateDisabledKeys();
	}, [fromTimestamp, toTimestamp]);

	const updateItems = async () => {
		const itemsSnapshot = await getDocs(collection(database, "items"));
		const categoriesSnapshot = await getDocs(
			collection(database, "categories")
		);

		setItems(
			itemsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
		);
		setCategories(
			categoriesSnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}))
		);
		setLoading(false);
	};

	useEffect(() => {
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

						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat"
								>
									Oldalméret
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								closeOnSelect
								selectedKeys={[rowsPerPage]}
								selectionMode="single"
								onSelectionChange={(keys) => {
									setRowsPerPage(
										parseInt(keys.currentKey || "")
									);
								}}
							>
								<DropdownItem key="25">25</DropdownItem>
								<DropdownItem key="50">50</DropdownItem>
								<DropdownItem key="100">100</DropdownItem>
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

	const bottomContent = useMemo(() => {
		return (
			<div className="py-2 px-2 flex justify-center items-center">
				<Pagination
					isCompact
					showControls
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>
			</div>
		);
	}, [itemsOnPage.length, page, pages, hasSearchFilter]);

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
				bottomContent={bottomContent}
				bottomContentPlacement="outside"
				onSortChange={setSortDescriptor}
				selectionMode="multiple"
				selectedKeys={selectedItems}
				onSelectionChange={setSelectedItems}
				disabledKeys={disabledKeys}
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
					items={itemsOnPage}
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
