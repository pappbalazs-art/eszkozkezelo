import { ReactNode } from "react";

import "./card.scss";

type CardProps = {
	children: ReactNode;
};

export default function Card({ children }: CardProps): ReactNode {
	return (
		<div className="card">
			<div className="card__container">{children}</div>
		</div>
	);
}
