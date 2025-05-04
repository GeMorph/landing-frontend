import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/pages/Reports";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/reports")({
	component: ReportsRoute,
});

function ReportsRoute() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-1">
				<Reports />
			</div>
		</div>
	);
}
