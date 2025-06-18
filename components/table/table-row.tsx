import { ReactNode } from "react";

import "./table-row.scss";

type TableRowProps = {
	children: ReactNode;
};

export default function TableRow({ children }: TableRowProps): ReactNode {
	return <tr className="table__row">{children}</tr>;
}
