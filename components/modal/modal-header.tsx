import { ReactNode } from "react";

type ModalHeaderProps = {
	children: ReactNode;
};

export default function ModalHeader({ children }: ModalHeaderProps): ReactNode {
	return <div className="modal__header">{children}</div>;
}
