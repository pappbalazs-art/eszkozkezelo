import { ReactNode } from "react";

type CardHeaderProps = {
	children: ReactNode;
};

export default function CardHeader({ children }: CardHeaderProps): ReactNode {
	return <header className="card__header">{children}</header>;
}
