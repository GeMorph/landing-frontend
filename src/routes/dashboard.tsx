import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";
import { Header } from "@/components/layout/main/Header/Header";
import { EmailConfirmedGuard } from "@/components/auth/EmailConfirmedGuard";

export const Route = createFileRoute("/dashboard")({
	component: DashboardRoute,
});

function DashboardRoute() {
	return (
		<EmailConfirmedGuard>
			<div className="flex flex-col min-h-screen">
				<Header />
				<div className="flex-1">
					<Dashboard />
				</div>
			</div>
		</EmailConfirmedGuard>
	);
}
