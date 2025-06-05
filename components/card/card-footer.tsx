import { ReactNode } from "react";

type CardFooterProps = {
	children: ReactNode;
};

export default function CardFooter({ children }: CardFooterProps): ReactNode {
	return <footer className="card__footer">{children}</footer>;
}
