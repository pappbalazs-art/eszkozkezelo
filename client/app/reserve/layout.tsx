export default function ReserveLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-4">
			<div className="inline-block">{children}</div>
		</section>
	);
}
