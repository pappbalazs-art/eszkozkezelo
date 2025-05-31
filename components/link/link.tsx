import { ReactNode } from "react";

import "./link.scss";

type LinkProps = {
	href: string;
	className?: string;
	children: ReactNode;
};

export default function Link({
	href,
	className,
	children,
}: LinkProps): ReactNode {
	return (
		<a href={href} className={className}>
			{children}
		</a>
	);
}
