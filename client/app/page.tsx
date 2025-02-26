"use client";

import { useAuth } from "@/AuthContext";
import ActiveReservations from "@/components/active-reservations";
import HomePageAlerts from "@/components/home-alerts";
import { Spacer } from "@heroui/spacer";

export default function Home() {
	const { user, isAuthenticated } = useAuth();

	return (
		<section className="flex flex-col gap-4">
			<div className="inline-block">
				{isAuthenticated && user.role === "admin" && (
					<>
						<HomePageAlerts />
						<ActiveReservations />
					</>
				)}
			</div>
		</section>
	);
}
