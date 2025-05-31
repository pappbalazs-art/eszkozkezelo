import { ReactNode } from "react";

type NavbarBrandType = {
	children: ReactNode;
};

export default function NavbarBrand({ children }: NavbarBrandType): ReactNode {
	return <div className="navbar__brand">{children}</div>;
}
