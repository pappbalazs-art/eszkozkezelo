import { ReactNode } from "react";

import "./card-title.scss";

type CardTitleProps = {
	children: string;
};

export default function CardTitle({ children }: CardTitleProps): ReactNode {
	return <h1 className="card__title">{children}</h1>;
}
