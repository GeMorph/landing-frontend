import { useState } from "react";
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

export const SubmitCase = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		priority: "medium",
		tags: "",
		dnaFile: null as File | null,
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Check file type
			if (!file.name.endsWith(".fasta") && !file.name.endsWith(".fa")) {
				toast.error("Please upload a valid FASTA file (.fasta or .fa)");
				e.target.value = ""; // Reset the input
				return;
			}
			setFormData((prev) => ({ ...prev, dnaFile: file }));
		}
	};

	const uploadFile = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				import.meta.env["VITE_CLOUDINARY_CASE_UPLOAD_PRESET"]
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
			let dnaFileUrl = null;

			if (formData.dnaFile) {
				try {
					setUploadingFile(true);
					dnaFileUrl = await uploadFile(formData.dnaFile);
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
				`${API_URL}/case`,
				{
					...formData,
					dnaFile: dnaFileUrl || null,
					tags: formData.tags
						.split(",")
						.map((tag) => tag.trim())
						.filter(Boolean),
				},
				{
					headers: {
						"X-Firebase-Token": token,
					},
				}
			);

			if (response.data.success) {
				toast.success("Case submitted successfully!");
				setFormData({
					title: "",
					description: "",
					priority: "medium",
					tags: "",
					dnaFile: null,
				});
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
			<div className="mx-auto max-w-2xl space-y-6">
				<div>
					<h1 className="text-2xl font-semibold">Submit New Case</h1>
					<p className="text-sm text-muted-foreground">
						Fill in the details below to submit a new case for analysis.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							placeholder="Enter case title"
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
							placeholder="Enter case description"
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
						<Label htmlFor="priority">Priority</Label>
						<Select
							value={formData.priority}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, priority: value }))
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

					<div className="space-y-2">
						<Label htmlFor="tags">Tags (comma-separated)</Label>
						<Input
							id="tags"
							placeholder="e.g. cancer, mutation, research"
							value={formData.tags}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, tags: e.target.value }))
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="dnaFile">DNA File (FASTA format)</Label>
						<div className="flex items-center gap-2">
							<Input
								id="dnaFile"
								type="file"
								accept=".fasta,.fa"
								onChange={handleFileChange}
								className="cursor-pointer"
							/>
							{formData.dnaFile && (
								<span className="text-sm text-muted-foreground">
									{formData.dnaFile.name}
								</span>
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							Upload a FASTA file containing the DNA sequence (.fasta or .fa)
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
								{uploadingFile ? "Uploading file..." : "Submitting case..."}
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Submit Case
							</>
						)}
					</Button>
				</form>
			</div>
		</DashboardLayout>
	);
};
