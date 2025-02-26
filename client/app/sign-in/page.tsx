"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/firebase";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";

export default function SignInPage() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	const router = useRouter();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form.email) {
			setErrors({ email: "Kérjük adjon meg egy email címet!" });
		}

		if (!form.password) {
			setErrors({ password: "Kérjük addjon meg egy jelszót!" });
		}

		if (!(form.email && form.password)) {
			return;
		}

		try {
			signInWithEmailAndPassword(auth, form.email, form.password);
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card
			className="px-10 py-10 w-[90vw] max-w-[450px]"
			shadow="sm"
			radius="lg"
		>
			<CardHeader>
				<h1 className="tracking-tight inline font-bold text-3xl">
					Bejelentkezés
				</h1>
			</CardHeader>
			<CardBody>
				<Form
					className="w-full"
					validationErrors={errors}
					onSubmit={handleSubmit}
				>
					<Input
						isRequired
						label="Email"
						labelPlacement="inside"
						size="sm"
						name="email"
						type="email"
						value={form.email}
						onChange={(e) => {
							setForm({ ...form, email: e.target.value });
						}}
					/>
					<Input
						isRequired
						label="Jelszó"
						labelPlacement="inside"
						size="sm"
						name="password"
						type="password"
						value={form.password}
						onChange={(e) => {
							setForm({ ...form, password: e.target.value });
						}}
					/>
					<Spacer y={2} />
					<Button type="submit" color="primary" variant="solid">
						Bejelentkezés
					</Button>
				</Form>
			</CardBody>
		</Card>
	);
}
