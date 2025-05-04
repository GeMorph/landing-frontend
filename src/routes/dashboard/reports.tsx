import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/pages/Reports";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/dashboard/reports")({
	component: ReportsRoute,
});

function ReportsRoute() {
	return (
		<>
			<Header />
			<Reports />
		</>
	);
} 