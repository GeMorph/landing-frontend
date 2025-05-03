import { createFileRoute } from "@tanstack/react-router";
import VerifyEmail from "@/pages/VerifyEmail";
import { Header } from "@/components/layout/main/Header/Header";
import { AuthCard } from "@/components/layout/auth/AuthCard";
import { EmailVerificationGuard } from "@/components/auth/EmailVerificationGuard";

export const Route = createFileRoute("/verify-email")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<EmailVerificationGuard>
			<Header />
			<AuthCard>
				<VerifyEmail />
			</AuthCard>
		</EmailVerificationGuard>
	);
}
