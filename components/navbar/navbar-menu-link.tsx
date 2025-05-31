import clsx from "clsx";
import { ReactNode, useContext } from "react";
import Link from "next/link";
import { NavbarContext } from "./navbar";
import { Color } from "@/types/color";

import "./navbar-menu-link.scss";

type NavbarMenuLinkProps = {
	href: string;
	color?: Color;
	children: ReactNode;
};

export default function NavbarMenuLink({
	color,
	href,
	children,
}: NavbarMenuLinkProps): ReactNode {
	const { closeMenu } = useContext(NavbarContext);

	return (
		<Link
			className={clsx("navbar__menu__link", color && "color-" + color)}
			href={href}
			onClick={closeMenu}
		>
			{children}
		</Link>
	);
}
