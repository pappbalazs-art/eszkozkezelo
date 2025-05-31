import { ReactNode } from "react";

import "./navbar-menu-item.scss";

type NavbarMenuItemProps = {
	children: ReactNode;
};

export default function NavbarMenuItem({
	children,
}: NavbarMenuItemProps): ReactNode {
	return <li className="navbar__menu__item">{children}</li>;
}
