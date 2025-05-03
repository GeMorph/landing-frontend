import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function EmailConfirmed() {
	const navigate = useNavigate();

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center space-y-4">
				<div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
					<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
				</div>
				<h2 className="text-2xl font-bold mb-6 text-center">Email Verified!</h2>
				<div className="text-center space-y-2">
					<p className="text-gray-600 dark:text-gray-300">
						Your email has been successfully verified. You can now access all
						features of the application.
					</p>
				</div>
			</div>

			<div className="flex flex-col items-center">
				<Button
					onClick={() => navigate({ to: "/" })}
					className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
				>
					Continue to Dashboard
				</Button>
			</div>
		</div>
	);
}
