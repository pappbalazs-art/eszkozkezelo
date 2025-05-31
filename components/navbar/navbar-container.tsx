import { ReactNode } from "react";

import "./navbar-container.scss";

type NavbarContainerProps = {
	children: ReactNode;
};

export default function NavbarContainer({
	children,
}: NavbarContainerProps): ReactNode {
	return <div className="navbar__container">{children}</div>;
}
