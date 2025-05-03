import { createFileRoute } from "@tanstack/react-router";
import { ResetPassword } from "../pages/ResetPassword";
import { Header } from "@/components/layout/main/Header/Header";
import { AuthCard } from "@/components/layout/auth/AuthCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const Route = createFileRoute("/reset-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AuthGuard>
			<Header />
			<AuthCard title="Reset Your Password">
				<ResetPassword />
			</AuthCard>
		</AuthGuard>
	);
}
