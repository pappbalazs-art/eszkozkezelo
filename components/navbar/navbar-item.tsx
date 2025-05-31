import { ReactNode } from "react";

import "./navbar-item.scss";

type NavbarItemProps = {
	children: ReactNode;
};

export default function NavbarItem({ children }: NavbarItemProps): ReactNode {
	return <li className="navbar__item">{children}</li>;
}
