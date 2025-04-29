// src/routes/login.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/layout/auth/AuthCard";
import { SignInForm } from "@/components/forms/auth";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<AuthCard title="Login">
				<SignInForm />
			</AuthCard>
		</>
	);
}
