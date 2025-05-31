import clsx from "clsx";
import { ReactNode, useContext } from "react";
import { NavbarContext } from "./navbar";

import "./navbar-wrapper.scss";

type NavbarWrapperProps = {
	children: ReactNode;
};

export default function NavbarWrapper({
	children,
}: NavbarWrapperProps): ReactNode {
	const { isMenuOpen } = useContext(NavbarContext);

	return (
		<nav className={clsx("navbar__wrapper", isMenuOpen && "open")}>
			{children}
		</nav>
	);
}
