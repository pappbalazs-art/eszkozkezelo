import { ReactNode } from "react";

import "./dropdown-menu-item.scss";

type DropdownMenuItemProps = {
	children: ReactNode;
};

export default function DropdownMenuItem({
	children,
}: DropdownMenuItemProps): ReactNode {
	return <li className="dropdown__menu__item">{children}</li>;
}
