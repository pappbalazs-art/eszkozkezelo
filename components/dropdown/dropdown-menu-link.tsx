import clsx from "clsx";
import { ReactElement, ReactNode, useContext } from "react";
import Link from "next/link";
import { Color } from "@/types/color";
import { DropdownContext } from "./dropdown";

import "./dropdown-menu-link.scss";

type DropdownMenuLinkProps = {
	href: string;
	icon?: ReactElement;
	color?: Color;
	onClick?: Function;
	children: ReactNode;
};

export default function DropdownMenuLink({
	href,
	icon,
	color,
	onClick,
	children,
}: DropdownMenuLinkProps): ReactNode {
	const { closeMenu } = useContext(DropdownContext);

	return (
		<Link
			className={clsx("dropdown__menu__link", color && "color-" + color)}
			href={href}
			onClick={() => {
				closeMenu();
				onClick && onClick();
			}}
		>
			{icon && <icon.type size={0.9} sizeUnit="rem" />}
			<span className="dropdown__menu__link__label">{children}</span>
		</Link>
	);
}
