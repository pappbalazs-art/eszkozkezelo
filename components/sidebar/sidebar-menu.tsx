import { ReactNode } from "react";

import "./sidebar-menu.scss";

type SidebarMenuProps = {
	children: ReactNode;
};

export default function SidebarMenu({ children }: SidebarMenuProps): ReactNode {
	return <ul className="sidebar__menu__container">{children}</ul>;
}
