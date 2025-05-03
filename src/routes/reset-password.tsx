import { createFileRoute } from "@tanstack/react-router";
import { ResetPassword } from "../pages/ResetPassword";
import { Header } from "@/components/layout/main/Header/Header";
import { AuthCard } from "@/components/layout/auth/AuthCard";

export const Route = createFileRoute("/reset-password")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<AuthCard >
				<ResetPassword />
			</AuthCard>
		</>
	);
}