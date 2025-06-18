import { ReactNode, useContext } from "react";
import clsx from "clsx";

import "./table-head-item.scss";
import { TableContext, TableSortDirection } from "./table";
import { ChevronDownIcon } from "../icons";

type TableHeadItemProps = {
	columnKey: string;
	children: string | undefined;
};

export default function TableHeadItem({
	columnKey,
	children,
}: TableHeadItemProps): ReactNode {
	const { sortDescriptor, setSortDescriptor } = useContext(TableContext);

	const changeSortDescriptor = (): void => {
		if (!children) {
			return;
		}

		let sortDirection: TableSortDirection;

		if (sortDescriptor.key === columnKey) {
			sortDirection =
				sortDescriptor.direction === "ascending"
					? "descending"
					: "ascending";
		} else {
			sortDirection = "ascending";
		}

		setSortDescriptor({
			key: columnKey,
			direction: sortDirection,
		});
	};

	const sortArrowDirection = (): string => {
		if (sortDescriptor.key === columnKey) {
			return sortDescriptor.direction;
		}

		return "";
	};

	return (
		<th className="table__head__item" onClick={changeSortDescriptor}>
			{children}
			{children && (
				<span
					className={clsx("table__sort__arrow", sortArrowDirection())}
				>
					<ChevronDownIcon size={0.7} sizeUnit="rem" />
				</span>
			)}
		</th>
	);
}
