import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

interface Report {
	id: string;
	caseNumber: number;
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
	const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
	const [userMongoId, setUserMongoId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<
		Report["status"] | "all"
	>("all");
	const [selectedType, setSelectedType] = useState<Report["type"] | "all">(
		"all"
	);
	const [selectedReport, setSelectedReport] = useState<Report | null>(null);

	useEffect(() => {
		if (!user) return;
		const fetchUserRole = async () => {
			try {
				const token = await user.getIdToken();
				const response = await axios.get(`${API_URL}/user/getuser`, {
					headers: { "X-Firebase-Token": token },
				});
				setIsAdmin(response.data.data.role === "admin");
				setUserMongoId(response.data.data._id);
				console.log("User role:", response.data.data.role);
			} catch (error) {
				setIsAdmin(false);
			}
		};
		fetchUserRole();
	}, [user]);

	useEffect(() => {
		if (!user || isAdmin === null) return;
		const fetchReports = async () => {
			try {
				setLoading(true);
				const token = await user.getIdToken();
				if (isAdmin) {
					console.log("Admin fetching all reports");
					const response = await axios.get(`${API_URL}/reports`, {
						headers: { "X-Firebase-Token": token },
					});
					if (response.data.success) {
						setReports(response.data.reports || []);
					}
				} else {
					const userResponse = await axios.get(`${API_URL}/user/getuser`, {
						headers: { "X-Firebase-Token": token },
					});
					console.log(
						"User object from /user/getuser:",
						userResponse.data.data
					);
					const userReports = Array.isArray(userResponse.data.data.reports)
						? userResponse.data.data.reports
						: [];
					setReports(userReports);
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

	const filteredReports = reports.filter((report) => {
		const matchesSearch =
			report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			report.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			selectedStatus === "all" || report.status === selectedStatus;
		const matchesType = selectedType === "all" || report.type === selectedType;

		if (!isAdmin) {
			return (
				matchesSearch &&
				matchesStatus &&
				matchesType &&
				report.user &&
				((typeof report.user === "string" && report.user === userMongoId) ||
					(typeof report.user === "object" &&
						(report.user as any)._id === userMongoId))
			);
		}

		return matchesSearch && matchesStatus && matchesType;
	});

	const statusOptions: Array<Report["status"] | "all"> = [
		"all",
		"draft",
		"published",
	];
	const typeOptions: Array<Report["type"] | "all"> = [
		"all",
		"analysis",
		"feedback",
		"summary",
	];

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

				<div className="flex flex-col gap-4 md:flex-row md:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search reports..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						<select
							className="rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={selectedStatus}
							onChange={(e) =>
								setSelectedStatus(e.target.value as Report["status"] | "all")
							}
						>
							{statusOptions.map((status) => (
								<option key={status} value={status}>
									{status === "all" ? "All Status" : status}
								</option>
							))}
						</select>
						<select
							className="rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={selectedType}
							onChange={(e) =>
								setSelectedType(e.target.value as Report["type"] | "all")
							}
						>
							{typeOptions.map((type) => (
								<option key={type} value={type}>
									{type === "all" ? "All Types" : type}
								</option>
							))}
						</select>
					</div>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : filteredReports.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							{searchQuery || selectedStatus !== "all" || selectedType !== "all"
								? "No reports match your search criteria"
								: isAdmin
									? "No reports have been created yet"
									: "You haven't submitted any reports yet"}
						</p>
					</div>
				) : (
					<div className="grid gap-6">
						{filteredReports.map((report) => (
							<Card key={report.id} className="hover:shadow-md transition-all">
								<CardHeader>
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div>
											<CardTitle className="text-xl">{`Report #${report.caseNumber}`}</CardTitle>
											{report.title && (
												<div className="text-sm text-muted-foreground font-medium mt-2">
													{report.title}
												</div>
											)}
										</div>
										<div className="flex flex-wrap gap-2 md:ml-auto mt-2 md:mt-0">
											<Badge
												variant="secondary"
												className={cn("px-3 py-1", getTypeColor(report.type))}
											>
												{report.type}
											</Badge>
											<Badge
												variant="secondary"
												className={cn(
													"px-3 py-1",
													getStatusColor(report.status)
												)}
											>
												{report.status}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div className="space-y-2">
											{isAdmin && (
												<p className="text-sm text-muted-foreground">
													Submitted by: {report.user.name}
												</p>
											)}
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<span>Created:</span>
												<span>
													{new Date(report.created_at).toLocaleDateString()}
												</span>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											className="self-start md:self-center"
											onClick={() => setSelectedReport(report)}
										>
											View Details
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				<Dialog
					open={!!selectedReport}
					onOpenChange={() => setSelectedReport(null)}
				>
					<DialogContent className="max-w-2xl w-full p-4 sm:p-6 rounded-2xl shadow-lg custom-dialog-center">
						<DialogHeader>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<DialogTitle asChild>
										<span className="text-lg font-semibold">{`Report #${selectedReport?.caseNumber}`}</span>
									</DialogTitle>
									{selectedReport?.title && (
										<div className="text-base text-muted-foreground font-medium mt-2">
											{selectedReport.title}
										</div>
									)}
								</div>
								<div className="flex gap-2 md:ml-auto mt-2 md:mt-0">
									<Badge
										variant="secondary"
										className={cn(
											"px-3 py-1",
											getStatusColor(selectedReport?.status || "")
										)}
									>
										{selectedReport?.status}
									</Badge>
									<Badge
										variant="secondary"
										className={cn(
											"px-3 py-1",
											getTypeColor(selectedReport?.type || "")
										)}
									>
										{selectedReport?.type}
									</Badge>
								</div>
							</div>
						</DialogHeader>
						<DialogDescription asChild>
							<div className="mt-4 space-y-4">
								{selectedReport?.description && (
									<p className="text-base">{selectedReport.description}</p>
								)}
								<div className="space-y-2 text-sm text-muted-foreground">
									{isAdmin && <p>Submitted by: {selectedReport?.user.name}</p>}
									<p>
										Created:{" "}
										{selectedReport?.created_at
											? new Date(selectedReport.created_at).toLocaleDateString()
											: ""}
									</p>
								</div>
							</div>
						</DialogDescription>
					</DialogContent>
				</Dialog>
			</div>
		</DashboardLayout>
	);
};
