import { createFileRoute } from "@tanstack/react-router";
import EmailConfirmed from "@/pages/EmailConfirmed";
import { Header } from "@/components/layout/main/Header/Header";
import { AuthCard } from "@/components/layout/auth/AuthCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const Route = createFileRoute("/email-confirmed")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AuthGuard>
			<Header />
			<AuthCard>
				<EmailConfirmed />
			</AuthCard>
		</AuthGuard>
	);
}
