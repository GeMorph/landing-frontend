import { createFileRoute } from "@tanstack/react-router";
import { SubmitCase } from "@/pages/SubmitCase";
import { Header } from "@/components/layout/main/Header/Header";
import { EmailConfirmedGuard } from "@/components/auth/EmailConfirmedGuard";

export const Route = createFileRoute("/submit-case")({
	component: SubmitCaseRoute,
});

function SubmitCaseRoute() {
	return (
		<EmailConfirmedGuard>
			<div className="flex flex-col min-h-screen">
				<Header />
			<div className="flex-1">
				<SubmitCase />
			</div>
		</div>
		</EmailConfirmedGuard>
	);
}
