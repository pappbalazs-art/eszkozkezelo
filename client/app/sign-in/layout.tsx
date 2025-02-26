export default function SignInLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center justify-center gap-4 md:py-10">
			<div className="inline-block max-w-lg justify-center">
				{children}
			</div>
		</section>
	);
}
