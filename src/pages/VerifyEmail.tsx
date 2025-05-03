import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/lib/auth";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleResendVerification = async () => {
		setLoading(true);
		try {
			await resendVerificationEmail();
			toast.success("Verification email sent successfully!");
		} catch (error: any) {
			toast.error(error.message || "Failed to send verification email");
		} finally {
			setLoading(false);
		}
	};

	return (
				<div className="space-y-6">
					<div className="flex flex-col items-center space-y-4">
						<div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
							<Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h2 className="text-2xl font-bold mb-6 text-center">
							Verify Your Email
						</h2>
						<div className="text-center space-y-2">
							<p className="text-gray-600 dark:text-gray-300">
								We've sent a verification email to your inbox. Please check your
								email and click the verification link to continue.
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Didn't receive the email? Check your spam folder or click below
								to resend.
							</p>
						</div>
					</div>

					<div className="flex flex-col items-center space-y-4">
						<Button
							onClick={handleResendVerification}
							disabled={loading}
							className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
						>
							{loading ? "Sending..." : "Resend Verification Email"}
						</Button>
						<button
							onClick={() => navigate({ to: "/" })}
							className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
						>
							Back to Home
						</button>
					</div>
				</div>
	);
}
