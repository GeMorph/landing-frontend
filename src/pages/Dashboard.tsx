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
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<Case["status"] | "all">(
		"all"
	);
	const [selectedPriority, setSelectedPriority] = useState<
		Case["priority"] | "all"
	>("all");
	const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
	const [userMongoId, setUserMongoId] = useState<string | null>(null);
	const [selectedCase, setSelectedCase] = useState<Case | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedCase, setEditedCase] = useState<Case | null>(null);
	const [users, setUsers] = useState<
		Array<{ _id: string; name: string; email: string }>
	>([]);

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
		const fetchCases = async () => {
			try {
				setLoading(true);
				const token = await user.getIdToken();

				if (isAdmin) {
					console.log("Admin fetching all cases");
					const response = await axios.get(`${API_URL}/case`, {
						headers: { "X-Firebase-Token": token },
					});
					console.log("Admin /case API response:", response.data);
					if (response.data.success) {
						setCases(response.data.data || []);
					}
				} else {
					// For regular users, get their user data which includes cases
					const userResponse = await axios.get(`${API_URL}/user/getuser`, {
						headers: { "X-Firebase-Token": token },
					});

					console.log(
						"User object from /user/getuser:",
						userResponse.data.data
					);

					// The cases are already populated in the user object
					const userCases = userResponse.data.data.cases || [];
					console.log("User cases:", userCases);

					// Transform the case data to match the expected format
					const formattedCases = userCases.map((caseItem: any) => ({
						id: caseItem._id,
						caseNumber: caseItem.caseNumber,
						title: caseItem.title,
						description: caseItem.description,
						priority: caseItem.priority,
						status: caseItem.status,
						createdAt: caseItem.createdAt,
						tags: caseItem.tags || [],
						dnaFile: caseItem.dnaFile,
						user: {
							_id: userResponse.data.data._id,
							name: userResponse.data.data.name,
							email: userResponse.data.data.email,
						},
					}));

					setCases(formattedCases);
				}
			} catch (error: any) {
				console.error("Error fetching cases:", error);
				toast.error(error.response?.data?.message || "Failed to fetch cases");
				setCases([]);
			} finally {
				setLoading(false);
			}
		};
		fetchCases();
	}, [user, isAdmin]);

	useEffect(() => {
		if (!user || !isAdmin) return;
		const fetchUsers = async () => {
			try {
				const token = await user.getIdToken();
				const response = await axios.get(`${API_URL}/user/allusers`, {
					headers: { "X-Firebase-Token": token },
				});
				if (response.data.success) {
					setUsers(response.data.data);
				}
			} catch (error) {
				console.error("Error fetching users:", error);
				toast.error("Failed to fetch users for assignment");
			}
		};
		fetchUsers();
	}, [user, isAdmin]);

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
				caseItem.user?._id === userMongoId
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

	const handleEdit = (caseItem: Case) => {
		setEditedCase(caseItem);
		setIsEditing(true);
	};

	const handleSaveCase = async () => {
		if (!selectedCase || !editedCase) return;

		try {
			const token = await user?.getIdToken();
			const response = await axios.put(
				`${API_URL}/case/${selectedCase.id}`,
				{
					status: editedCase.status,
					priority: editedCase.priority,
					assignedTo: editedCase.assignedTo?._id,
				},
				{
					headers: { "X-Firebase-Token": token },
				}
			);

			if (response.data.success) {
				setCases(
					cases.map((c) =>
						c.id === selectedCase.id ? { ...c, ...editedCase } : c
					)
				);
				setIsEditing(false);
				toast.success("Case updated successfully");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to update case");
		}
	};

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
								{isAdmin && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(selectedCase!)}
									>
										{isEditing ? "Cancel" : "Edit"}
									</Button>
								)}
							</div>
						</DialogHeader>
						<DialogDescription asChild>
							<div className="mt-4 space-y-4">
								{selectedCase?.description && (
									<p className="text-base mt-2">{selectedCase.description}</p>
								)}
								{isEditing ? (
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="text-sm font-medium">Status</label>
												<select
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
													value={editedCase?.status}
													onChange={(e) =>
														setEditedCase((prev) =>
															prev
																? {
																		...prev,
																		status: e.target.value as Case["status"],
																	}
																: null
														)
													}
												>
													{statusOptions
														.filter((s) => s !== "all")
														.map((status) => (
															<option key={status} value={status}>
																{status.replace("_", " ")}
															</option>
														))}
												</select>
											</div>
											<div>
												<label className="text-sm font-medium">Priority</label>
												<select
													className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
													value={editedCase?.priority}
													onChange={(e) =>
														setEditedCase((prev) =>
															prev
																? {
																		...prev,
																		priority: e.target
																			.value as Case["priority"],
																	}
																: null
														)
													}
												>
													{priorityOptions
														.filter((p) => p !== "all")
														.map((priority) => (
															<option key={priority} value={priority}>
																{priority}
															</option>
														))}
												</select>
											</div>
										</div>
										<div>
											<label className="text-sm font-medium">Assign To</label>
											<select
												className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
												value={editedCase?.assignedTo?._id || ""}
												onChange={(e) => {
													const selectedUser = users.find(
														(u) => u._id === e.target.value
													);
													setEditedCase((prev) =>
														prev
															? {
																	...prev,
																	assignedTo: selectedUser || null,
																}
															: null
													);
												}}
											>
												<option value="">Unassigned</option>
												{users.map((user) => (
													<option key={user._id} value={user._id}>
														{user.name} ({user.email})
													</option>
												))}
											</select>
										</div>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												onClick={() => setIsEditing(false)}
											>
												Cancel
											</Button>
											<Button onClick={handleSaveCase}>Save Changes</Button>
										</div>
									</div>
								) : (
									<div className="space-y-2 text-sm text-muted-foreground mt-2">
										{isAdmin && (
											<p>
												Submitted by: {selectedCase?.user?.name || "Unknown"}
											</p>
										)}
										{selectedCase?.assignedTo && (
											<p>Assigned to: {selectedCase.assignedTo.name}</p>
										)}
										<p>
											Created:{" "}
											{selectedCase?.createdAt
												? new Date(selectedCase.createdAt).toLocaleDateString()
												: ""}
										</p>
									</div>
								)}
							</div>
						</DialogDescription>
					</DialogContent>
				</Dialog>
			</div>
		</DashboardLayout>
	);
};
