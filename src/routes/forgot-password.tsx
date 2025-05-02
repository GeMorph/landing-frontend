import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Header } from "@/components/layout/main/Header/Header";
import { AuthCard } from "@/components/layout/auth/AuthCard";

export const Route = createFileRoute("/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<AuthCard title="Reset Password">
				<ForgotPassword />
			</AuthCard>
		</>
	);
}
