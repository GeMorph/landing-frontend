import { createFileRoute } from "@tanstack/react-router";
import { Privacy } from "@/pages/Privacy";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/privacy")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<Privacy />
		</>
	);
}
