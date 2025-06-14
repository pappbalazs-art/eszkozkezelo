import { ReactNode } from "react";

import "./dropdown-menu.scss";

type DropdownMenuProps = {
	children: ReactNode;
};

export default function DropdownMenu({
	children,
}: DropdownMenuProps): ReactNode {
	return <ul className="dropdown__menu">{children}</ul>;
}
