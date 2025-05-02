import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/layout/main/Header/Header";

export const ResetPassword = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);

		const searchParams = new URLSearchParams(window.location.search);
		const actionCode = searchParams.get("oobCode");
		if (!actionCode) {
			toast.error("Invalid reset link");
			return;
		}

		try {
			await confirmPasswordReset(auth, actionCode, password);
			toast.success("Password reset successful!");
			navigate({ to: "/login" });
		} catch (error: any) {
			console.error("Reset error:", error);
			toast.error(error.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
					<div className="bg-white dark:bg-gray-800">
						<div className="text-center mb-8">
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
								Please enter your new password
							</p>
						</div>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<div>
									<Label htmlFor="password" className="text-sm font-medium">
										New Password
									</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											minLength={6}
											className="mt-1 pr-10"
											placeholder="Enter new password"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>

								<div>
									<Label
										htmlFor="confirmPassword"
										className="text-sm font-medium"
									>
										Confirm Password
									</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
											minLength={6}
											className="mt-1 pr-10"
											placeholder="Confirm new password"
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
										>
											{showConfirmPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>
							</div>

							<Button
								type="submit"
								disabled={loading}
								className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
							>
								{loading ? "Resetting..." : "Reset Password"}
							</Button>
						</form>
					</div>
	);
};
