import { ReactNode } from "react";

import "./sidebar-container.scss";

type SidebarContainerProps = {
	children: ReactNode;
};

export default function SidebarContainer({
	children,
}: SidebarContainerProps): ReactNode {
	return <div className="sidebar__container">{children}</div>;
}
