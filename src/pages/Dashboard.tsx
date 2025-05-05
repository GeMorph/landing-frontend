import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FileText, Plus, Search } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { CardTitle } from "@/components/ui/card";

interface Case {
	id: string;
	caseNumber: number;
	title: string;
	description: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in_progress" | "resolved" | "closed";
	createdAt: string;
	tags: string[];
	user: {
		_id: string;
		name: string;
		email: string;
	} | null;
	assignedTo: {
		_id: string;
		name: string;
		email: string;
	} | null;
}

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

export const Dashboard = () => {
	const { user } = useAuth();
	const [cases, setCases] = useState<Case[]>([]);
	const [loading, setLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<Case["status"] | "all">(
		"all"
	);
	const [selectedPriority, setSelectedPriority] = useState<
		Case["priority"] | "all"
	>("all");
	const [isAdmin, setIsAdmin] = useState(false);
	const [selectedCase, setSelectedCase] = useState<Case | null>(null);

	useEffect(() => {
		if (!user || hasFetched) return;

		const fetchUserRole = async () => {
			try {
				const token = await user?.getIdToken();
				const response = await axios.get(`${API_URL}/user/getuser`, {
					headers: {
						"X-Firebase-Token": token,
					},
				});

				if (response.data.success) {
					setIsAdmin(response.data.data.role === "admin");
				}
			} catch (error) {
				console.error("Error fetching user role:", error);
				toast.error("Failed to fetch user role");
			}
		};

		const fetchCases = async () => {
			try {
				const token = await user?.getIdToken();
				const response = await axios.get(`${API_URL}/case`, {
					headers: {
						"X-Firebase-Token": token,
					},
				});

				console.log("Cases API response:", response.data);

				if (response.data.success) {
					setCases(response.data.data || []);
				}
			} catch (error: any) {
				console.error("Error fetching cases:", error);
				toast.error(error.response?.data?.message || "Failed to fetch cases");
				setCases([]);
			} finally {
				setLoading(false);
				setHasFetched(true);
			}
		};

		fetchUserRole();
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

	const filteredCases = cases.filter((caseItem) => {
		const matchesSearch =
			caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			caseItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			caseItem.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);

		const matchesStatus =
			selectedStatus === "all" || caseItem.status === selectedStatus;
		const matchesPriority =
			selectedPriority === "all" || caseItem.priority === selectedPriority;

		// If not admin, only show user's own cases
		if (!isAdmin) {
			return (
				matchesSearch &&
				matchesStatus &&
				matchesPriority &&
				caseItem.user?._id === user?.uid
			);
		}

		return matchesSearch && matchesStatus && matchesPriority;
	});

	const statusOptions: Array<Case["status"] | "all"> = [
		"all",
		"open",
		"in_progress",
		"resolved",
		"closed",
	];
	const priorityOptions: Array<Case["priority"] | "all"> = [
		"all",
		"low",
		"medium",
		"high",
		"urgent",
	];

	return (
		<DashboardLayout>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold">
							{isAdmin ? "All Cases" : "My Cases"}
						</h1>
						<p className="text-sm text-muted-foreground">
							{loading
								? "Loading cases..."
								: filteredCases.length > 0
									? `${filteredCases.length} case${filteredCases.length === 1 ? "" : "s"} found`
									: "No cases found"}
						</p>
					</div>
					<Button
						asChild
						size="sm"
						className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
					>
						<Link to="/submit-case" className="gap-2">
							<Plus className="h-4 w-4" />
							Submit New Case
						</Link>
					</Button>
				</div>

				<div className="flex flex-col gap-4 md:flex-row md:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search cases..."
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
								setSelectedStatus(e.target.value as Case["status"] | "all")
							}
						>
							{statusOptions.map((status) => (
								<option key={status} value={status}>
									{status === "all" ? "All Status" : status.replace("_", " ")}
								</option>
							))}
						</select>
						<select
							className="rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={selectedPriority}
							onChange={(e) =>
								setSelectedPriority(e.target.value as Case["priority"] | "all")
							}
						>
							{priorityOptions.map((priority) => (
								<option key={priority} value={priority}>
									{priority === "all" ? "All Priorities" : priority}
								</option>
							))}
						</select>
					</div>
				</div>

				{loading ? (
					<div className="mt-8 flex justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					</div>
				) : filteredCases.length === 0 ? (
					<div className="mt-16 flex flex-col items-center justify-center text-center">
						<FileText className="h-12 w-12 text-muted-foreground" />
						<h3 className="mt-4 text-lg font-semibold">No cases found</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							{searchQuery ||
							selectedStatus !== "all" ||
							selectedPriority !== "all"
								? "Try adjusting your search or filters"
								: "Get started by submitting a new case."}
						</p>
						<Button asChild variant="outline" className="mt-4 gap-2">
							<Link to="/submit-case">
								<Plus className="h-4 w-4" />
								Submit Case
							</Link>
						</Button>
					</div>
				) : (
					<div className="mt-8 grid gap-6">
						{filteredCases.map((caseItem) => (
							<div
								key={caseItem.id}
								className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
							>
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div>
										<h2 className="text-xl font-semibold tracking-tight">{`Case #${caseItem.caseNumber}`}</h2>
										{caseItem.title && (
											<div className="text-sm text-muted-foreground font-medium mt-2">
												{caseItem.title}
											</div>
										)}
									</div>
									<div className="flex flex-wrap gap-2 md:ml-auto">
										{caseItem.tags &&
											caseItem.tags.length > 0 &&
											caseItem.tags.map((tag) => (
												<Badge key={tag} variant="secondary">
													{tag}
												</Badge>
											))}
										<span
											className={cn(
												"rounded-full px-3 py-1 text-xs font-medium",
												getPriorityColor(caseItem.priority)
											)}
										>
											{caseItem.priority}
										</span>
										<span
											className={cn(
												"rounded-full px-3 py-1 text-xs font-medium",
												getStatusColor(caseItem.status)
											)}
										>
											{caseItem.status.replace("_", " ")}
										</span>
									</div>
								</div>
								<div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<span>Created:</span>
											<span>
												{new Date(caseItem.createdAt).toLocaleDateString()}
											</span>
										</div>
										{isAdmin && (
											<p className="text-sm text-muted-foreground">
												Submitted by: {caseItem.user?.name || "Unknown"}
											</p>
										)}
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="self-start md:self-center"
										onClick={() => setSelectedCase(caseItem)}
									>
										View Details
									</Button>
								</div>
							</div>
						))}
					</div>
				)}

				<Dialog
					open={!!selectedCase}
					onOpenChange={() => setSelectedCase(null)}
				>
					<DialogContent className="max-w-2xl w-full mx-auto p-4 sm:p-6 rounded-2xl shadow-lg">
						<DialogHeader>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<DialogTitle asChild>
										<span className="text-lg font-semibold">{`Case #${selectedCase?.caseNumber}`}</span>
									</DialogTitle>
									{selectedCase?.title && (
										<div className="text-base text-muted-foreground font-medium mt-2">
											{selectedCase.title}
										</div>
									)}
								</div>
								<div className="flex flex-wrap gap-2 md:ml-auto mt-2 md:mt-0">
									{selectedCase?.tags &&
										selectedCase.tags.length > 0 &&
										selectedCase.tags.map((tag) => (
											<Badge key={tag} variant="secondary">
												{tag}
											</Badge>
										))}
									{selectedCase?.priority && (
										<span
											className={cn(
												"rounded-full px-3 py-1 text-xs font-medium",
												getPriorityColor(selectedCase.priority)
											)}
										>
											{selectedCase.priority}
										</span>
									)}
									{selectedCase?.status && (
										<span
											className={cn(
												"rounded-full px-3 py-1 text-xs font-medium",
												getStatusColor(selectedCase.status)
											)}
										>
											{selectedCase.status.replace("_", " ")}
										</span>
									)}
								</div>
							</div>
						</DialogHeader>
						<DialogDescription asChild>
							<div className="mt-4 space-y-4">
								{selectedCase?.description && (
									<p className="text-base mt-2">{selectedCase.description}</p>
								)}
								<div className="space-y-2 text-sm text-muted-foreground mt-2">
									{isAdmin && (
										<p>Submitted by: {selectedCase?.user?.name || "Unknown"}</p>
									)}
									<p>
										Created:{" "}
										{selectedCase?.createdAt
											? new Date(selectedCase.createdAt).toLocaleDateString()
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
