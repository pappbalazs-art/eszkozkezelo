import {
	ChangeEvent,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useRef,
} from "react";
import clsx from "clsx";
import { FormContext } from "../form";

import "./textarea.scss";

type TextareaLabelPlacementType = "inside" | "outside";
type TextareaProps = {
	className?: string;
	required?: boolean;
	label?: string;
	labelPlacement?: TextareaLabelPlacementType;
	name: string;
	value: string;
	onValueChange: Dispatch<SetStateAction<string>>;
	fullWidth?: boolean;
};

export default function Textarea({
	className,
	required = false,
	label,
	labelPlacement = "outside",
	name,
	value,
	onValueChange,
	fullWidth = false,
}: TextareaProps): ReactNode {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { errors, setError } = useContext(FormContext);

	const getTextareaClassNames = (): string => {
		return clsx(
			className,
			"textarea",
			required && "textarea--required",
			fullWidth && "textarea--full-width"
		);
	};

	const getLabelClassNames = (): string => {
		return clsx("textarea__label", "textarea__label--" + labelPlacement);
	};

	const setTextareaFocused = (): void => {
		if (!textareaRef.current) {
			return;
		}

		textareaRef.current.focus();
	};

	const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
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
			className={getTextareaClassNames()}
			{...(errors && errors[name] && { "data-error": errors[name] })}
		>
			<textarea
				ref={textareaRef}
				className="textarea__field"
				name={name}
				value={value}
				onChange={handleValueChange}
				onBlur={handleBlur}
			/>
			{label && (
				<label
					className={getLabelClassNames()}
					onClick={setTextareaFocused}
				>
					{label}
				</label>
			)}
		</div>
	);
}
