import { ReactNode } from "react";

type ModalBodyProps = {
	children: ReactNode;
};

export default function ModalBody({ children }: ModalBodyProps): ReactNode {
	return <div className="modal__body">{children}</div>;
}
