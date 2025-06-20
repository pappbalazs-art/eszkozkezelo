import { ReactNode } from "react";

type ModalFooterProps = {
	children: ReactNode;
};

export default function ModalFooter({ children }: ModalFooterProps): ReactNode {
	return <div className="model__footer">{children}</div>;
}
