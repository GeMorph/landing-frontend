import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FileText, Plus } from "lucide-react";

interface Case {
	id: string;
	title: string;
	description: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in_progress" | "resolved" | "closed";
	createdAt: string;
}

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

export const Dashboard = () => {
	const { user } = useAuth();
	const [cases, setCases] = useState<Case[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);

	useEffect(() => {
		if (!user || hasFetched) return;

		const fetchCases = async () => {
			try {
				const token = await user?.getIdToken();
				const response = await axios.get(`${API_URL}/case`, {
					headers: {
						"X-Firebase-Token": token,
					},
				});

				if (response.data.success) {
					setCases(response.data.data);
				}
			} catch (error: any) {
				console.error("Error fetching cases:", error);
				toast.error(error.response?.data?.message || "Failed to fetch cases");
			} finally {
				setLoading(false);
				setHasFetched(true);
			}
		};

		fetchCases();
	}, [user, hasFetched]);

	const getPriorityColor = (priority: Case["priority"]) => {
		switch (priority) {
			case "low":
				return "bg-green-100 text-green-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "high":
				return "bg-orange-100 text-orange-800";
			case "urgent":
				return "bg-red-100 text-red-800";
		}
	};

	const getStatusColor = (status: Case["status"]) => {
		switch (status) {
			case "open":
				return "bg-blue-100 text-blue-800";
			case "in_progress":
				return "bg-purple-100 text-purple-800";
			case "resolved":
				return "bg-green-100 text-green-800";
			case "closed":
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<DashboardLayout>
			<div className="flex h-[40px] items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">My Cases</h1>
					<p className="text-sm text-muted-foreground">
						{loading ? "Loading cases..." : "No cases found"}
					</p>
				</div>
				<Button
					asChild
					size="sm"
					className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
				>
					<Link to="/dashboard/submit-case" className="gap-2">
						<Plus className="h-4 w-4" />
						Submit New Case
					</Link>
				</Button>
			</div>

			{loading ? (
				<div className="mt-8 flex justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				</div>
			) : cases.length === 0 ? (
				<div className="mt-16 flex flex-col items-center justify-center text-center">
					<FileText className="h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-semibold">No cases yet</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Get started by submitting a new case.
					</p>
					<Button asChild variant="outline" className="mt-4 gap-2">
						<Link to="/dashboard/submit-case">
							<Plus className="h-4 w-4" />
							Submit Case
						</Link>
					</Button>
				</div>
			) : (
				<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{cases.map((caseItem) => (
						<div
							key={caseItem.id}
							className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
						>
							<div className="flex items-start justify-between">
								<h2 className="text-lg font-semibold tracking-tight">
									{caseItem.title}
								</h2>
								<div className="flex gap-2">
									<span
										className={cn(
											"rounded-full px-2.5 py-1 text-xs font-medium",
											getPriorityColor(caseItem.priority)
										)}
									>
										{caseItem.priority}
									</span>
									<span
										className={cn(
											"rounded-full px-2.5 py-1 text-xs font-medium",
											getStatusColor(caseItem.status)
										)}
									>
										{caseItem.status.replace("_", " ")}
									</span>
								</div>
							</div>
							<p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
								{caseItem.description}
							</p>
							<div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
								<span>
									Created: {new Date(caseItem.createdAt).toLocaleDateString()}
								</span>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
								>
									View Details
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</DashboardLayout>
	);
};
