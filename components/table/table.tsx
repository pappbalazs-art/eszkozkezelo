import clsx from "clsx";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";

import { Category } from "@/types/category";
import { Item } from "@/types/item";

import "./table.scss";

export type TableItemTypes = Category | Item;
export type TableColumnType = {
	key: string;
	label?: string;
};
export type TableSortDirection = "ascending" | "descending";
export type TableSortDescriptor = {
	key: string;
	direction: TableSortDirection;
};

type TableContextType = {
	columns: Array<TableColumnType>;
	sortedItems: Array<TableItemTypes>;
	hasSearchBar: boolean;
	searchParam: string;
	setSearchParam: Dispatch<SetStateAction<string>>;
	sortDescriptor: TableSortDescriptor;
	setSortDescriptor: Dispatch<SetStateAction<TableSortDescriptor>>;
	isLoading: boolean;
};

export const TableContext = createContext<TableContextType>(
	{} as TableContextType
);

type TableProps = {
	items: Array<TableItemTypes>;
	columns: Array<TableColumnType>;
	hasSearchBar?: boolean;
	searchFilter?: (searchParam: string, item: any) => boolean;
	isLoading?: boolean;
	children: ReactNode;
};

export default function Table({
	items,
	columns,
	hasSearchBar = false,
	searchFilter,
	isLoading = false,
	children,
}: TableProps): ReactNode {
	const [animationsEnded, setAnimationsEnded] = useState<boolean>(false);
	const [searchParam, setSearchParam] = useState<string>("");
	const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>(
		{} as TableSortDescriptor
	);

	const filteredItems: Array<TableItemTypes> =
		useMemo((): Array<TableItemTypes> => {
			let filteredItems = [...items];

			if (hasSearchBar && searchFilter && searchParam) {
				filteredItems = filteredItems.filter(
					(item: TableItemTypes): boolean =>
						searchFilter(searchParam, item)
				);
			}

			return filteredItems;
		}, [items, hasSearchBar, searchFilter, searchParam]);

	const sortedItems: Array<TableItemTypes> =
		useMemo((): Array<TableItemTypes> => {
			return [...filteredItems].sort(
				(a: TableItemTypes, b: TableItemTypes) => {
					const first = a[sortDescriptor.key as keyof TableItemTypes];
					const second =
						b[sortDescriptor.key as keyof TableItemTypes];
					const cmp = first < second ? -1 : first > second ? 1 : 0;

					return sortDescriptor.direction === "descending"
						? -cmp
						: cmp;
				}
			);
		}, [sortDescriptor, filteredItems]);

	useEffect(() => {
		if (!columns) {
			return;
		}

		setSortDescriptor({
			key: columns[0].key,
			direction: "ascending",
		});
	}, [columns]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setAnimationsEnded(true);
		}, 1250);

		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<TableContext.Provider
			value={{
				columns,
				sortedItems,
				hasSearchBar,
				searchParam,
				setSearchParam,
				sortDescriptor,
				setSortDescriptor,
				isLoading,
			}}
		>
			{!isLoading && (
				<div
					className={clsx(
						"table__wrapper",
						animationsEnded && "animations-ended"
					)}
				>
					{children}
				</div>
			)}
		</TableContext.Provider>
	);
}
