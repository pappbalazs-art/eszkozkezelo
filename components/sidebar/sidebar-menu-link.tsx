import clsx from "clsx";
import { ReactElement, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import "./sidebar-menu-link.scss";

type SidebarMenuLinkProps = {
	href: string;
	icon: ReactElement;
	children: ReactNode;
};

export default function SidebarMenuLink({
	href,
	icon,
	children,
}: SidebarMenuLinkProps): ReactNode {
	const pathname = usePathname();

	const isActive = (): boolean => {
		return href === pathname;
	};

	const getClassNames = (): string => {
		return clsx("sidebar__menu__link", isActive() && "active");
	};

	return (
		<Link className={getClassNames()} href={href}>
			{<icon.type size={15} />}
			<span className="sidebar__menu__link__label">{children}</span>
		</Link>
	);
}
