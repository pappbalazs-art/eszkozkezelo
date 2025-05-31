import { ReactNode } from "react";

import "./navbar-content.scss";

type NavbarContentProps = {
	children: ReactNode;
};

export default function NavbarContent({
	children,
}: NavbarContentProps): ReactNode {
	return <ul className="navbar__content">{children}</ul>;
}
