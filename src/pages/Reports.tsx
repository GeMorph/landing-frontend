import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

interface Report {
	id: string;
	title: string;
	description: string;
	type: string;
	status: string;
	created_at: string;
	user: {
		name: string;
		email: string;
	};
}

export const Reports = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const fetchUserRole = async () => {
			if (!user) return;
			try {
				const token = await user.getIdToken();
				const response = await axios.get(`${API_URL}/user/getuser`, {
					headers: {
						"X-Firebase-Token": token,
					},
				});
				setIsAdmin(response.data.data.role === "admin");
			} catch (error) {
				console.error("Error fetching user role:", error);
				toast.error("Failed to fetch user role");
			}
		};

		fetchUserRole();
	}, [user]);

	useEffect(() => {
		const fetchReports = async () => {
			if (!user) return;
			try {
				setLoading(true);
				const token = await user.getIdToken();
				const response = await axios.get(`${API_URL}/reports`, {
					headers: {
						"X-Firebase-Token": token,
					},
				});

				if (response.data.success) {
					// If user is admin, show all reports, otherwise filter by user
					const filteredReports = isAdmin
						? response.data.reports
						: response.data.reports.filter(
								(report: Report) => report.user.email === user.email
							);
					setReports(filteredReports || []);
				}
			} catch (error: any) {
				console.error("Error fetching reports:", error);
				toast.error(error.response?.data?.message || "Failed to fetch reports");
				setReports([]);
			} finally {
				setLoading(false);
			}
		};

		fetchReports();
	}, [user, isAdmin]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "draft":
				return "bg-yellow-500";
			case "published":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "analysis":
				return "bg-blue-500";
			case "feedback":
				return "bg-purple-500";
			case "summary":
				return "bg-orange-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold">Reports</h1>
						<p className="text-sm text-muted-foreground">
							{isAdmin
								? "View and manage all reports"
								: "View your submitted reports"}
						</p>
					</div>
					{isAdmin && (
						<Button onClick={() => navigate({ to: "/create-report" })}>
							<Plus className="mr-2 h-4 w-4" />
							Create Report
						</Button>
					)}
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : reports.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							{isAdmin
								? "No reports have been created yet"
								: "You haven't submitted any reports yet"}
						</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{reports.map((report) => (
							<Card key={report.id}>
								<CardHeader>
									<div className="flex items-start justify-between">
										<CardTitle className="line-clamp-1">
											{report.title}
										</CardTitle>
										<div className="flex gap-2">
											<Badge
												variant="secondary"
												className={getStatusColor(report.status)}
											>
												{report.status}
											</Badge>
											<Badge
												variant="secondary"
												className={getTypeColor(report.type)}
											>
												{report.type}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground line-clamp-2">
										{report.description}
									</p>
									{isAdmin && (
										<p className="mt-4 text-sm text-muted-foreground">
											Submitted by: {report.user.name}
										</p>
									)}
									<p className="mt-2 text-sm text-muted-foreground">
										{new Date(report.created_at).toLocaleDateString()}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
};
