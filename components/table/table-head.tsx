import { ReactNode } from "react";

import "./table-head.scss";

type TableHeadProps = {
	children: ReactNode;
};

export default function TableHead({ children }: TableHeadProps): ReactNode {
	return (
		<thead className="table__head">
			<tr className="table__head__container">{children}</tr>
		</thead>
	);
}
