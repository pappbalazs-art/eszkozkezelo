import clsx from "clsx";
import {
	AutoFill,
	ChangeEvent,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useRef,
} from "react";

import "./input.scss";
import { FormContext } from "../form";

type InputVariants = "solid" | "bordered";
type InputSizes = "default" | "compact";
type InputType = "text" | "email" | "password" | "search";
type InputLabelPlacementType = "inside" | "outside";

type InputProps = {
	className?: string;
	variant?: InputVariants;
	size?: InputSizes;
	type: InputType;
	required?: boolean;
	label?: string;
	labelPlacement?: InputLabelPlacementType;
	name: string;
	value: string;
	defaultValue?: string;
	onValueChange: Dispatch<SetStateAction<string>>;
	autofill?: AutoFill;
	fullWidth?: boolean;
};

export default function Input({
	className,
	variant = "bordered",
	size = "default",
	type,
	required = false,
	label,
	labelPlacement = "outside",
	name,
	value,
	defaultValue,
	onValueChange,
	autofill,
	fullWidth = false,
}: InputProps): ReactNode {
	const inputRef = useRef<HTMLInputElement>(null);

	const { errors, setError } = useContext(FormContext);

	const getInputClassNames = (): string => {
		return clsx(
			className,
			"input",
			"input--" + variant,
			"input--" + size,
			required && "input--required",
			fullWidth && "input--full-width"
		);
	};

	const getLabelClassNames = (): string => {
		return clsx("input__label", "input__label--" + labelPlacement);
	};

	const setInputFocused = (): void => {
		if (!inputRef.current) {
			return;
		}

		inputRef.current.focus();
	};

	const handleValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
		onValueChange(e.target.value);

		if (required) {
			setError(name, "");
		}
	};

	const handleBlur = (): void => {
		if (required && !value) {
			setError(name, "A mező kitöltése kötelező.");
		}
	};

	return (
		<div
			className={getInputClassNames()}
			{...(errors && errors[name] && { "data-error": errors[name] })}
		>
			<input
				ref={inputRef}
				className="input__field"
				type={type}
				name={name}
				value={value}
				defaultValue={defaultValue}
				onChange={handleValueChange}
				onBlur={handleBlur}
				autoComplete={autofill}
			/>
			{label && (
				<label
					className={getLabelClassNames()}
					onClick={setInputFocused}
				>
					{label}
				</label>
			)}
		</div>
	);
}
