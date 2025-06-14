import { ReactNode, useContext } from "react";

import "./dropdown-trigger.scss";
import { DropdownContext } from "./dropdown";

type DropdownTriggerProps = {
	children: ReactNode;
};

export default function DropdownTrigger({
	children,
}: DropdownTriggerProps): ReactNode {
	const { toggleMenu } = useContext(DropdownContext);

	return (
		<div className="dropdown__trigger" onClick={toggleMenu}>
			{children}
		</div>
	);
}
