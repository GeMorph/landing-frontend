import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface Report {
	id: string;
	title: string;
	description: string;
	type: "analysis" | "feedback" | "summary";
	status: "draft" | "published";
	createdAt: string;
	publishedAt?: string;
}

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

export const Reports = () => {
	const { user } = useAuth();
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);

	useEffect(() => {
		if (!user || hasFetched) return;

		const fetchReports = async () => {
			try {
				const token = await user?.getIdToken();
				const response = await axios.get(`${API_URL}/reports`, {
					headers: {
						"X-Firebase-Token": token,
					},
				});

				if (response.data.success) {
					setReports(response.data.data);
				}
			} catch (error: any) {
				console.error("Error fetching reports:", error);
				toast.error(error.response?.data?.message || "Failed to fetch reports");
			} finally {
				setLoading(false);
				setHasFetched(true);
			}
		};

		fetchReports();
	}, [user, hasFetched]);

	const getReportTypeStyle = (type: Report["type"]) => {
		switch (type) {
			case "analysis":
				return "bg-purpl    e-100 text-purple-800";
			case "feedback":
				return "bg-blue-100 text-blue-800";
			case "summary":
				return "bg-green-100 text-green-800";
		}
	};

	return (
		<DashboardLayout>
			<div className="flex h-[40px] items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Reports</h1>
					<p className="text-sm text-muted-foreground">
						{loading
							? "Loading reports..."
							: "View reports from the admin team"}
					</p>
				</div>
			</div>

			{loading ? (
				<div className="mt-8 flex justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				</div>
			) : reports.length === 0 ? (
				<div className="mt-16 flex flex-col items-center justify-center text-center">
					<FileText className="h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-semibold">No reports available</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Reports will appear here when published by the admin team.
					</p>
				</div>
			) : (
				<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{reports.map((report) => (
						<div
							key={report.id}
							className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
						>
							<div className="flex items-start justify-between">
								<h2 className="text-lg font-semibold tracking-tight">
									{report.title}
								</h2>
								<span
									className={cn(
										"rounded-full px-2.5 py-1 text-xs font-medium",
										getReportTypeStyle(report.type)
									)}
								>
									{report.type}
								</span>
							</div>
							<p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
								{report.description}
							</p>
							<div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
								<span>
									{report.status === "published" && report.publishedAt
										? `Published: ${new Date(report.publishedAt).toLocaleDateString()}`
										: "Draft"}
								</span>
								<button className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
									View Report →
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</DashboardLayout>
	);
};
