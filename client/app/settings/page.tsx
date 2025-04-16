"use client";

import withAuth from "@/utils/withAuth";

import { Spacer } from "@heroui/spacer";

const SettingsPage = () => {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Beállítások
			</h1>

			<Spacer y={5} />
		</>
	);
};

export default withAuth(SettingsPage);
