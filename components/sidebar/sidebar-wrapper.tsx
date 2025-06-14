import { ReactNode } from "react";

import "./sidebar-wrapper.scss";

type SidebarWrapperProps = {
	children: ReactNode;
};

export default function SidebarWrapper({
	children,
}: SidebarWrapperProps): ReactNode {
	return <nav className="sidebar__wrapper">{children}</nav>;
}
