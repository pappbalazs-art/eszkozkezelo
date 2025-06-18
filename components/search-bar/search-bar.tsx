import { ReactNode, useContext } from "react";
import { Input } from "../input";
import { TableContext } from "../table/table";

export default function SearchBar(): ReactNode {
	const { searchParam, setSearchParam } = useContext(TableContext);

	return (
		<Input
			className="search-bar"
			size="compact"
			type="search"
			name="search"
			label="Keresés..."
			labelPlacement="inside"
			value={searchParam}
			onValueChange={setSearchParam}
		/>
	);
}
