"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Selection, SortDescriptor } from "@heroui/react";

import { database } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import ICategory from "../../interfaces/category.i";

import { Input } from "@heroui/input";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import {
	ChevronDownIcon,
	PlusIcon,
	SearchIcon,
	VerticalDotsIcon,
} from "@/components/icons";
import { Button } from "@heroui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/table";
import { useDisclosure } from "@heroui/use-disclosure";
import { Spinner } from "@heroui/spinner";

import CreateCategoryModal from "./create-category-modal";
import EditCategoryModal from "./edit-category-modal";
import DeleteCategoryModal from "./delete-category-modal";

export const columns = [
	{ name: "NÉV", uid: "name", sortable: true },
	{ name: "ELEMEK SZÁMA", uid: "length", sortable: true },
	{ name: "AKCIÓK", uid: "actions", sortable: false },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "length", "actions"];

export default function CategoriesTable() {
	const [categories, setCategories] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const createCategoryModalDisclosure = useDisclosure();
	const editCategoryModalDisclosure = useDisclosure();
	const deleteCategoryModalDisclosure = useDisclosure();

	const [filterValue, setFilterValue] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<ICategory>({
		id: "",
		name: "",
	});
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "name",
		direction: "descending",
	});

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredCategories = [...categories];

		if (hasSearchFilter) {
			filteredCategories = filteredCategories.filter((category) =>
				category.name.toLowerCase().includes(filterValue.toLowerCase())
			);
		}

		return filteredCategories;
	}, [categories, filterValue]);

	const sortedItems = useMemo(() => {
		console.log(categories);

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

	const updateCategories = async () => {
		const snapshot = await getDocs(collection(database, "categories"));
		const categories = await Promise.all(
			snapshot.docs.map(async (doc: any) => {
				const itemsRef = collection(database, "items");
				const itemsQuery = query(
					itemsRef,
					where("category_uid", "==", doc.id)
				);
				const itemsSnapshot = await getDocs(itemsQuery);

				return {
					...doc.data(),
					id: doc.id,
					length: itemsSnapshot.docs.length,
				};
			})
		);

		setCategories(categories);
		setLoading(false);
	};

	useEffect(() => {
		updateCategories();
	}, []);

	const renderCell = useCallback((category: any, columnKey: React.Key) => {
		const cellValue = category[columnKey as keyof any];

		switch (columnKey) {
			case "name":
				return <p className="font-bold">{cellValue}</p>;
			case "actions":
				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<VerticalDotsIcon className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu variant="flat">
								<DropdownItem
									key="edit"
									onPress={() => {
										setSelectedCategory(category);
										editCategoryModalDisclosure.onOpen();
									}}
								>
									Szerkesztés
								</DropdownItem>
								<DropdownItem
									key="delete"
									color="danger"
									onPress={() => {
										setSelectedCategory(category);
										deleteCategoryModalDisclosure.onOpen();
									}}
								>
									<Link color="danger" size="sm">
										Törlés
									</Link>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				);
			default:
				return cellValue;
		}
	}, []);

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
									Oszlopok
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem
										key={column.uid}
										className="capitalize"
									>
										{column.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>

						<Button
							color="primary"
							endContent={<PlusIcon />}
							onPress={createCategoryModalDisclosure.onOpen}
						>
							Új hozzáadása
						</Button>
					</div>
				</div>
			</div>
		);
	}, [filterValue, visibleColumns, onSearchChange, hasSearchFilter]);

	return (
		<>
			<CreateCategoryModal
				isOpen={createCategoryModalDisclosure.isOpen}
				onOpen={createCategoryModalDisclosure.onOpen}
				onOpenChange={createCategoryModalDisclosure.onOpenChange}
				updateCategories={updateCategories}
			/>

			<EditCategoryModal
				isOpen={editCategoryModalDisclosure.isOpen}
				onOpen={editCategoryModalDisclosure.onOpen}
				onOpenChange={editCategoryModalDisclosure.onOpenChange}
				selectedCategory={selectedCategory}
				updateCategories={updateCategories}
			/>

			<DeleteCategoryModal
				isOpen={deleteCategoryModalDisclosure.isOpen}
				onOpen={deleteCategoryModalDisclosure.onOpen}
				onOpenChange={deleteCategoryModalDisclosure.onOpenChange}
				selectedCategory={selectedCategory}
				updateCategories={updateCategories}
			/>

			<Table
				className="z-0"
				isStriped
				sortDescriptor={sortDescriptor}
				topContent={topContent}
				topContentPlacement="outside"
				onSortChange={setSortDescriptor}
				removeWrapper
			>
				<TableHeader columns={headerColumns}>
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
					emptyContent={"Nem található egyetlen kategória sem..."}
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
