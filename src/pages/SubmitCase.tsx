import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

export const SubmitCase = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		priority: "low" as "low" | "medium" | "high" | "urgent",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const token = await user?.getIdToken();
			const response = await axios.post(
				`${API_URL}/case/submit`,
				{
					...formData,
					createdBy: user?.uid,
				},
				{
					headers: {
						"X-Firebase-Token": token,
					},
				}
			);

			if (response.data.success) {
				toast.success("Case submitted successfully!");
				navigate({ to: "/dashboard" });
			}
		} catch (error: any) {
			console.error("Error submitting case:", error);
			toast.error(error.response?.data?.message || "Failed to submit case");
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-2xl">
				<div className="flex h-[40px] items-center">
					<div>
						<h1 className="text-2xl font-semibold">Submit New Case</h1>
						<p className="text-sm text-muted-foreground">
							Fill in the details below to submit a new case
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-2">
						<label htmlFor="title" className="text-sm font-medium">
							Title
						</label>
						<Input
							id="title"
							placeholder="Enter case title"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium">
							Description
						</label>
						<Textarea
							id="description"
							placeholder="Describe your case in detail"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							required
							className="min-h-[150px]"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="priority" className="text-sm font-medium">
							Priority
						</label>
						<Select
							value={formData.priority}
							onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
								setFormData({ ...formData, priority: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
								<SelectItem value="urgent">Urgent</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate({ to: "/dashboard" })}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Submitting..." : "Submit Case"}
						</Button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
};
