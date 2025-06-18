import { ReactNode, useContext } from "react";

import "./table-container.scss";
import { TableColumnType, TableContext } from "./table";
import TableHeadItem from "./table-head-item";
import TableHead from "./table-head";

type TableContainerProps = {
	children: ReactNode;
};

export default function TableContainer({
	children,
}: TableContainerProps): ReactNode {
	const { columns } = useContext(TableContext);

	return (
		<table className="table__container">
			<TableHead>
				{columns.map(
					(column: TableColumnType): ReactNode => (
						<TableHeadItem key={column.key} columnKey={column.key}>
							{column.label}
						</TableHeadItem>
					)
				)}
			</TableHead>
			{children}
		</table>
	);
}
