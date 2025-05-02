import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await sendPasswordResetEmail(auth, email);
			toast.success("Password reset email sent!");
			setEmail("");
		} catch (error: any) {
			toast.error(error.message || "Failed to send reset email");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
			<p className="text-center text-gray-600 dark:text-gray-400 mb-6">
				Enter your email address and we'll send you a link to reset your
				password.
			</p>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="john.doe@example.com"
						required
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700"
				>
					{loading ? "Sending..." : "Send Reset Link"}
				</Button>

				<div className="text-center text-sm">
					<Link
						to="/login"
						className="text-blue-600 hover:underline dark:text-blue-400"
					>
						← Back to Sign In
					</Link>
				</div>
			</form>
		</div>
	);
};
