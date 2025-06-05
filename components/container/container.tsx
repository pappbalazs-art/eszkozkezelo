import clsx from "clsx";
import { ReactNode } from "react";

import "./container.scss";

type ContainerProps = {
	centered?: boolean;
	children: ReactNode;
};

export default function Container({
	centered,
	children,
}: ContainerProps): ReactNode {
	return (
		<div className={clsx("container", centered && "container--centered")}>
			{children}
		</div>
	);
}
