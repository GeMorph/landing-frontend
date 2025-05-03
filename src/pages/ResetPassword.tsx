import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmResetPassword, validatePassword } from "@/lib/auth";

type ResetPasswordSearch = {
	mode?: string;
	oobCode?: string;
};

export const ResetPassword = () => {
	const navigate = useNavigate();
	const search = useSearch({ from: "/reset-password" }) as ResetPasswordSearch;
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [resetting, setResetting] = useState(false);

	useEffect(() => {
		const mode = search.mode;
		const oobCode = search.oobCode;

		if (mode !== "resetPassword" || !oobCode) {
			navigate({ to: "/" });
		}
	}, [search, navigate]);

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		const oobCode = search.oobCode;

		if (!oobCode) {
			toast.error("Invalid reset link");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		const validation = validatePassword(newPassword);
		if (!validation.isValid) {
			toast.error(validation.message);
			return;
		}

		setResetting(true);
		try {
			await confirmResetPassword(oobCode, newPassword);
			toast.success("Password reset successfully!");
			navigate({ to: "/" });
		} catch (error: any) {
			toast.error(error.message || "Failed to reset password");
		} finally {
			setResetting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
					<p className="text-gray-600 mt-2">
						Please enter your new password below
					</p>
					<div className="mt-4 text-sm text-gray-600 text-left">
						<p>Password must contain:</p>
						<ul className="list-disc list-inside">
							<li>At least 8 characters</li>
							<li>One uppercase letter</li>
							<li>One lowercase letter</li>
							<li>One number</li>
							<li>One special character</li>
						</ul>
					</div>
				</div>

				<form onSubmit={handleReset} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							minLength={8}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={8}
						/>
					</div>

					<Button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700"
						disabled={resetting}
					>
						{resetting ? "Resetting..." : "Reset Password"}
					</Button>
				</form>
			</div>
		</div>
	);
};
