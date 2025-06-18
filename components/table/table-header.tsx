import { ReactNode, useContext } from "react";
import { TableContext } from "./table";
import { SearchBar } from "../search-bar";

import "./table-header.scss";

type TableHeaderProps = {
	children: ReactNode;
};

export default function TableHeader({ children }: TableHeaderProps): ReactNode {
	const { hasSearchBar } = useContext(TableContext);

	return (
		<header className="table__header">
			{hasSearchBar && <SearchBar />}
			{children}
		</header>
	);
}
