import { ReactNode } from "react";

import "./container-title.scss";

type ContainerTitleProps = {
	children: string;
};

export default function ContainerTitle({
	children,
}: ContainerTitleProps): ReactNode {
	return <h1 className="container__title">{children}</h1>;
}
