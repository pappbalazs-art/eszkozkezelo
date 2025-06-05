import {
	createContext,
	Dispatch,
	FormEvent,
	ReactNode,
	SetStateAction,
} from "react";

import "./form.scss";

export type FormError = Record<string, string>;

type FormContextType = {
	errors: FormError;
	setError(name: string, value: string): void;
};

export const FormContext = createContext<FormContextType>(
	{} as FormContextType
);

export function setFormError(
	state: FormError,
	stateChangeFunction: Dispatch<SetStateAction<FormError>>,
	name: string,
	value: string
): void {
	stateChangeFunction({
		...state,
		[name]: value,
	});
}

type FormProps = {
	errors: FormError;
	setErrors: Dispatch<SetStateAction<FormError>>;
	handleSubmit: () => void;
	children: ReactNode;
};

export default function Form({
	errors,
	setErrors,
	handleSubmit,
	children,
}: FormProps): ReactNode {
	const setError = (name: string, value: string): void => {
		setFormError(errors, setErrors, name, value);
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		handleSubmit();
	};

	return (
		<FormContext.Provider value={{ errors, setError }}>
			<form className="form__container" onSubmit={onSubmit}>
				{children}
			</form>
		</FormContext.Provider>
	);
}
