import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Upload } from "lucide-react";

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

interface User {
	_id: string;
	firebase_id: string;
	name: string;
	email: string;
	role: string;
}

interface Case {
	id: string;
	title: string;
	description: string;
	priority: string;
	status: string;
	createdAt: string;
	tags: string[];
	dnaFile: null | {
		url: string;
		name: string;
		size: number;
		type: string;
	};
}

export default function CreateReport() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [allCases, setAllCases] = useState<Case[]>([]);
	const [filteredCases, setFilteredCases] = useState<Case[]>([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		type: "analysis",
		status: "draft",
		assignedTo: "",
		caseId: "",
		reportFile: null as File | null,
	});

	useEffect(() => {
		const fetchUsersAndCases = async () => {
			if (!user) return;
			try {
				const token = await user.getIdToken();
				const [usersResponse, casesResponse] = await Promise.all([
					axios.get(`${API_URL}/user/allusers`, {
						headers: {
							"X-Firebase-Token": token,
						},
					}),
					axios.get(`${API_URL}/case`, {
						headers: {
							"X-Firebase-Token": token,
						},
					}),
				]);

				if (usersResponse.data.success) {
					const validUsers = (usersResponse.data.data || []).filter(
						(user: User): user is User => user && typeof user._id === "string"
					);
					console.log("Users data:", validUsers);
					setUsers(validUsers);
				}
				if (casesResponse.data.success) {
					const cases = casesResponse.data.data || [];
					setAllCases(cases);
					setFilteredCases(cases);
				}
			} catch (error) {
				console.error("Error fetching users and cases:", error);
				toast.error("Failed to fetch users and cases");
				setAllCases([]);
				setFilteredCases([]);
				setUsers([]);
			}
		};

		fetchUsersAndCases();
	}, [user]);

	useEffect(() => {
		const fetchUserCases = async () => {
			if (!user || !formData.assignedTo) {
				setFilteredCases(allCases);
				return;
			}

			try {
				const token = await user.getIdToken();
				const response = await axios.get(
					`${API_URL}/case/user/${formData.assignedTo}`,
					{
						headers: {
							"X-Firebase-Token": token,
						},
					}
				);

				if (response.data.success) {
					const userCases = response.data.data || [];
					console.log("User cases:", userCases);
					setFilteredCases(userCases);
					if (
						formData.caseId &&
						!userCases.find((c: Case) => c.id === formData.caseId)
					) {
						setFormData((prev) => ({ ...prev, caseId: "" }));
					}
				}
			} catch (error) {
				console.error("Error fetching user cases:", error);
				toast.error("Failed to fetch user cases");
				setFilteredCases([]);
			}
		};

		fetchUserCases();
	}, [formData.assignedTo, user]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const allowedTypes = [
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				"text/plain",
			];

			if (!allowedTypes.includes(file.type)) {
				toast.error(
					"Please upload a valid document file (PDF, DOC, DOCX, or TXT)"
				);
				e.target.value = ""; // Reset the input
				return;
			}
			setFormData((prev) => ({ ...prev, reportFile: file }));
		}
	};

	const uploadFile = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				import.meta.env["VITE_CLOUDINARY_REPORT_UPLOAD_PRESET"]
			);
			formData.append(
				"cloud_name",
				import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"]
			);

			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/${import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"]}/raw/upload`,
				formData
			);

			return response.data.secure_url;
		} catch (error: any) {
			console.error("Error uploading file:", error);
			toast.error("Failed to upload file. Please try again.");
			throw error;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			setLoading(true);
			let fileUrl = null;

			if (formData.reportFile) {
				try {
					setUploadingFile(true);
					fileUrl = await uploadFile(formData.reportFile);
				} catch (error) {
					setUploadingFile(false);
					setLoading(false);
					return; // Stop form submission if file upload fails
				} finally {
					setUploadingFile(false);
				}
			}

			const token = await user.getIdToken();
			const response = await axios.post(
				`${API_URL}/reports`,
				{
					...formData,
					user: formData.assignedTo,
					case: formData.caseId || undefined,
					attachments: fileUrl
						? [
								{
									url: fileUrl,
									name: formData.reportFile?.name,
									size: formData.reportFile?.size,
									type: formData.reportFile?.type,
								},
							]
						: [],
				},
				{
					headers: {
						"X-Firebase-Token": token,
					},
				}
			);

			if (response.data.success) {
				toast.success("Report created successfully!");
				navigate({ to: "/reports" });
			}
		} catch (error: any) {
			console.error("Error creating report:", error);
			toast.error(error.response?.data?.message || "Failed to create report");
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-2xl space-y-6">
				<div>
					<h1 className="text-2xl font-semibold">Create New Report</h1>
					<p className="text-sm text-muted-foreground">
						Fill in the details below to create a new report.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							placeholder="Enter report title"
							value={formData.title}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, title: e.target.value }))
							}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Enter report description"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="type">Report Type</Label>
						<Select
							value={formData.type}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, type: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select report type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem key="type-analysis" value="analysis">
									Analysis
								</SelectItem>
								<SelectItem key="type-feedback" value="feedback">
									Feedback
								</SelectItem>
								<SelectItem key="type-summary" value="summary">
									Summary
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							value={formData.status}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, status: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem key="status-draft" value="draft">
									Draft
								</SelectItem>
								<SelectItem key="status-published" value="published">
									Published
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="assignedTo">Assign To</Label>
						<Select
							value={formData.assignedTo || ""}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, assignedTo: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select user" />
							</SelectTrigger>
							<SelectContent>
								{users.map((user: User) => (
									<SelectItem key={`user-${user._id}`} value={user._id}>
										{`${user.name} (${user.email})`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="caseId">Related Case</Label>
						<Select
							value={formData.caseId || ""}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, caseId: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select case" />
							</SelectTrigger>
							<SelectContent>
								{filteredCases.map((caseItem) => (
									<SelectItem key={`case-${caseItem.id}`} value={caseItem.id}>
										{`${caseItem.title} (${caseItem.priority})`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{filteredCases.length === 0 && (
							<p className="text-sm text-muted-foreground">
								No cases available
							</p>
						)}
					</div>

					<div className="space-y-2 mb-6">
						<Label htmlFor="reportFile">
							Report File (PDF, DOC, DOCX, or TXT)
						</Label>
						<div className="flex items-center gap-2">
							<Input
								id="reportFile"
								type="file"
								accept=".pdf,.doc,.docx,.txt"
								onChange={handleFileChange}
								className="cursor-pointer"
							/>
							{formData.reportFile && (
								<span className="text-sm text-muted-foreground">
									{formData.reportFile.name}
								</span>
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							Upload a document containing the report details
						</p>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={loading || uploadingFile}
					>
						{loading || uploadingFile ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{uploadingFile ? "Uploading file..." : "Creating Report..."}
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Create Report
							</>
						)}
					</Button>
				</form>
			</div>
		</DashboardLayout>
	);
}
