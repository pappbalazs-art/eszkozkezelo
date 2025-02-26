"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth, database } from "@/firebase";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";

export default function SignUpPage() {
	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		email: "",
		neptunCode: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});

	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form.email) {
			console.log("email erorr");
			setErrors({ email: "Kérjük adjon meg egy email címet!" });
			return;
		}

		if (!form.password) {
			console.log("password error");
			setErrors({ password: "Kérjük addjon meg egy jelszót!" });
			return;
		}

		if (form.password !== form.confirmPassword) {
			setErrors({ confirmPassword: "A jelszavak nem egyeznek!" });
			return;
		}

		if (!(form.email && form.password)) {
			return;
		}

		await createUserWithEmailAndPassword(auth, form.email, form.password)
			.then((userCredential) => {
				const user = userCredential.user;
				const userID = user.uid;

				const docRef = addDoc(collection(database, "users"), {
					user_uid: userID,
					name: form.firstname + " " + form.lastname,
					neptun_code: form.neptunCode,
					role: "user",
					status: "inactive",
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				console.log(errorCode, errorMessage);
			})
			.finally(() => {
				router.push("/");
			});
	};

	return (
		<Card
			className="px-10 py-10 w-[90vw] max-w-[450px]"
			shadow="sm"
			radius="lg"
		>
			<CardHeader>
				<h1 className="tracking-tight inline font-bold text-3xl">
					Regisztráció
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
						label="Vezetéknév"
						labelPlacement="inside"
						size="sm"
						name="firstname"
						type="text"
						value={form.firstname}
						onChange={(e) => {
							setForm({ ...form, firstname: e.target.value });
						}}
					/>
					<Input
						isRequired
						label="Keresztnév"
						labelPlacement="inside"
						size="sm"
						name="lastname"
						type="text"
						value={form.lastname}
						onChange={(e) => {
							setForm({ ...form, lastname: e.target.value });
						}}
					/>
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
						label="Neptun Kód"
						labelPlacement="inside"
						size="sm"
						name="neptun_code"
						type="text"
						value={form.neptunCode}
						onChange={(e) => {
							setForm({ ...form, neptunCode: e.target.value });
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
					<Input
						isRequired
						label="Jelszó megerősítése"
						labelPlacement="inside"
						size="sm"
						name="confirmPassword"
						type="password"
						value={form.confirmPassword}
						onChange={(e) => {
							setForm({
								...form,
								confirmPassword: e.target.value,
							});
						}}
					/>
					<Spacer y={2} />
					<Button type="submit" color="primary" variant="solid">
						Regisztráció
					</Button>
				</Form>
			</CardBody>
		</Card>
	);
}
