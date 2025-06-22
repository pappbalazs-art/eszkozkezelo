import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";
import clsx from "clsx";
import { useClickOutside } from "@/utils/use-click-outside";

import "./select.scss";
import { ChevronDownIcon } from "../icons";
import { FormContext } from "../form";

type SelectContextType = {
	handleValueChange: (key: string, value: string) => void;
};

export const SelectContext = createContext<SelectContextType>(
	{} as SelectContextType
);

export type Selection = {
	key: string;
	value: string;
};

type SelectLabelPlacementType = "inside" | "outside";
type SelecProps = {
	className?: string;
	required?: boolean;
	label?: string;
	labelPlacement?: SelectLabelPlacementType;
	name: string;
	value: Selection;
	onValueChange: Dispatch<SetStateAction<Selection>>;
	fullWidth?: boolean;
	children?: ReactNode;
};

export default function Select({
	className,
	required = false,
	label,
	labelPlacement = "outside",
	name,
	value,
	onValueChange,
	fullWidth = false,
	children,
}: SelecProps): ReactNode {
	const selectInputRef = useRef<HTMLDivElement>(null);
	const selectInputFieldRef = useRef<HTMLInputElement>(null);

	const { errors, setError } = useContext(FormContext);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const getInputClassNames = (): string => {
		return clsx(
			className,
			"select",
			required && "select--required",
			fullWidth && "select--full-width",
			isMenuOpen && "open"
		);
	};

	const getLabelClassNames = (): string => {
		return clsx("select__label", "select__label--" + labelPlacement);
	};

	const setSelectInputFocused = (): void => {
		if (!selectInputRef.current) {
			return;
		}

		selectInputRef.current.focus();
	};

	const openMenu = useCallback((): void => {
		setIsMenuOpen(true);
	}, [setIsMenuOpen]);

	const closeMenu = useCallback((): void => {
		setIsMenuOpen(false);
	}, [setIsMenuOpen]);

	const handleValueChange = (key: string, value: string): void => {
		onValueChange({ key, value });

		if (required) {
			setError(name, "");
		}
	};

	const handleBlur = useCallback((): void => {
		if (required && !("key" in value)) {
			setError(name, "A mező kitöltése kötelező.");
		}

		closeMenu();
	}, [required, value, setError, name, closeMenu]);

	useClickOutside(selectInputRef, closeMenu);

	return (
		<SelectContext.Provider value={{ handleValueChange }}>
			<div
				className={getInputClassNames()}
				{...(errors && errors[name] && { "data-error": errors[name] })}
			>
				<div
					ref={selectInputRef}
					className="select__input"
					onClick={openMenu}
				>
					<input
						ref={selectInputFieldRef}
						className="select__field"
						name={name}
						value={value.value || ""}
						onFocus={openMenu}
						onBlur={handleBlur}
						readOnly
					/>
					{label && (
						<label
							className={getLabelClassNames()}
							onClick={setSelectInputFocused}
						>
							{label}
						</label>
					)}
					<ChevronDownIcon />
				</div>
				<ul className="select__menu" onClick={closeMenu}>
					{children}
				</ul>
			</div>
		</SelectContext.Provider>
	);
}
