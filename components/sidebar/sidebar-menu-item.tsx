import { ReactNode } from "react";

import "./sidebar-menu-item.scss";

type SidebarMenuItemProps = {
	children: ReactNode;
};

export default function SidebarMenuItem({
	children,
}: SidebarMenuItemProps): ReactNode {
	return <li className="sidebar__menu__item">{children}</li>;
}
