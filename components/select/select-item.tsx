import { ReactNode, useContext } from "react";
import { SelectContext } from "./select";

import "./select-item.scss";

type SelectItemProps = {
	value: string;
	children: string;
};

export default function SelectItem({
	value,
	children,
}: SelectItemProps): ReactNode {
	const { handleValueChange } = useContext(SelectContext);

	const handleSelection = (): void => {
		handleValueChange(value, children);
	};

	return (
		<li className="select__menu__item" onClick={handleSelection}>
			{children}
		</li>
	);
}
