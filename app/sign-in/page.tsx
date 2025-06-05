"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/card";
import { Container } from "@/components/container";
import { Form, FormError, setFormError } from "@/components/form";
import { Input } from "@/components/input";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";

import withNoAuth from "@/utils/with-no-auth";

function SignInPage(): ReactNode {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errors, setErrors] = useState<FormError>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	const isButtonDisabled = (): boolean => {
		return !(email && password);
	};

	const handleSignIn = async (): Promise<void> => {
		try {
			setIsLoading(true);

			await signInWithEmailAndPassword(auth, email, password);

			router.push("/");
		} catch (error) {
			if (error instanceof FirebaseError) {
				setFormError(
					errors,
					setErrors,
					"password",
					"Hibás email cím vagy jelszó."
				);
			} else {
				setFormError(
					errors,
					setErrors,
					"password",
					"Valami hiba történt. Kérjük próbálja meg újra!"
				);
			}

			setPassword("");
			setIsLoading(false);
		}
	};

	return (
		<Container centered>
			<Card>
				<CardHeader>
					<CardTitle>Bejelentkezés</CardTitle>
				</CardHeader>
				<CardBody>
					<Form
						errors={errors}
						setErrors={setErrors}
						handleSubmit={handleSignIn}
					>
						<Input
							type="email"
							name="email"
							label="E-mail cím"
							value={email}
							onValueChange={setEmail}
							fullWidth
							required
						/>

						<Input
							type="password"
							name="password"
							label="Jelszó"
							value={password}
							onValueChange={setPassword}
							fullWidth
							required
						/>

						<Button
							fullWidth
							isLoading={isLoading}
							isDisabled={isButtonDisabled()}
						>
							Bejelentkezés
						</Button>
					</Form>
				</CardBody>
			</Card>
		</Container>
	);
}

export default withNoAuth(SignInPage);
