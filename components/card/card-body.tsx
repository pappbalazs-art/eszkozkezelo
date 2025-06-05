import { ReactNode } from "react";

type CardBodyProps = {
	children: ReactNode;
};

export default function CardBody({ children }: CardBodyProps): ReactNode {
	return <main className="card__body">{children}</main>;
}
