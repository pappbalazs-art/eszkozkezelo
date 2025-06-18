import { ReactNode } from "react";

import "./table-column.scss";

type TableColumnProps = {
	children: ReactNode;
};

export default function TableColumn({ children }: TableColumnProps): ReactNode {
	return <td className="table__column">{children}</td>;
}
