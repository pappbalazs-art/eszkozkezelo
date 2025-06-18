import { ReactElement, ReactNode } from "react";
import Link from "next/link";

import "./dropdown-menu-link.scss";

type DropdownMenuLinkProps = {
	href: string;
	icon?: ReactElement;
	children: ReactNode;
};

export default function DropdownMenuLink({
	href,
	icon,
	children,
}: DropdownMenuLinkProps): ReactNode {
	return (
		<Link className="dropdown__menu__link" href={href}>
			{icon && <icon.type size={15} />}
			{children}
		</Link>
	);
}
