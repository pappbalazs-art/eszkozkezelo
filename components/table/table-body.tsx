import { cloneElement, ReactElement, ReactNode, useContext } from "react";

import "./table-body.scss";
import { TableItemTypes, TableContext } from "./table";

type TableBodyProps<T> = {
	children: (item: T) => ReactElement;
};

export default function TableBody<T>({
	children,
}: TableBodyProps<T>): ReactNode {
	const { sortedItems } = useContext(TableContext);

	return (
		<tbody className="table__body">
			{sortedItems.map(
				(item: TableItemTypes, key: number): ReactElement =>
					cloneElement(children(item as T), { key })
			)}
		</tbody>
	);
}
