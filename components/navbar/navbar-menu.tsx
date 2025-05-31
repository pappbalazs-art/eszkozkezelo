import { ReactNode } from "react";

import "./navbar-menu.scss";

type NavbarMenuProps = {
	children: ReactNode;
};

export default function NavbarMenu({ children }: NavbarMenuProps): ReactNode {
	return <ul className="navbar__menu__container">{children}</ul>;
}
