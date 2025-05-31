import { ReactNode, useContext } from "react";
import { NavbarContext } from "./navbar";
import Link from "next/link";

type NavbarLinkProps = {
	href: string;
	children: ReactNode;
};

export default function NavbarLink({
	href,
	children,
}: NavbarLinkProps): ReactNode {
	const { closeMenu } = useContext(NavbarContext);

	return (
		<Link className="navbar__link" href={href} onClick={closeMenu}>
			{children}
		</Link>
	);
}
