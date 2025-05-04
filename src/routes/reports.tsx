import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/pages/Reports";
import { Header } from "@/components/layout/main/Header/Header";
import { EmailConfirmedGuard } from "@/components/auth/EmailConfirmedGuard";

export const Route = createFileRoute("/reports")({
	component: ReportsRoute,
});

function ReportsRoute() {
	return (
		<EmailConfirmedGuard>
			<div className="flex flex-col min-h-screen">
				<Header />
				<div className="flex-1">
				<Reports />
			</div>
		</div>
		</EmailConfirmedGuard>
	);
}
