import { createFileRoute } from "@tanstack/react-router";
import { SubmitCase } from "@/pages/SubmitCase";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/dashboard/submit-case")({
	component: SubmitCaseRoute,
});

function SubmitCaseRoute() {
	return (
		<>
			<Header />
			<SubmitCase />
		</>
	);
}
