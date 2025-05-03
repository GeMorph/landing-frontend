import { createFileRoute } from "@tanstack/react-router";
import EmailConfirmed from "@/pages/EmailConfirmed";
import { Header } from "@/components/layout/main/Header/Header";
import { AuthCard } from "@/components/layout/auth/AuthCard";
import { EmailConfirmedGuard } from "@/components/auth/EmailConfirmedGuard";

export const Route = createFileRoute("/email-confirmed")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<EmailConfirmedGuard>
			<Header />
			<AuthCard>
				<EmailConfirmed />
			</AuthCard>
		</EmailConfirmedGuard>
	);
}
