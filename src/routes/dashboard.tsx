import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<Dashboard />
		</>
	);
}
