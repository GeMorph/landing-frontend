import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
	const navigate = useNavigate();
	const { user, signOut } = useAuth();
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.classList.toggle("dark", savedTheme === "dark");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	const handleNavigation = (path: string) => {
		navigate({ to: path });
	};

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate({ to: "/" });
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<header className="flex items-center justify-between px-7 md:px-8 lg:px-10 xl:px-12 mx-0 py-2 border-b bg-background text-foreground font-inter sticky top-0 z-50 bg-white dark:bg-black rounded-md shadow-sm">
			{/* Logo */}
			<Link to="/" className="inline-block">
				<div className="flex items-center justify-between space-x-2 text-2xl font-bold">
					<img
						src="/logo-bright.png"
						alt="logo"
						className="h-5 md:h-6 lg:h-7 dark:hidden"
					/>
					<img
						src="/logo-dark.png"
						alt="logo-dark"
						className="h-5 md:h-6 lg:h-7 hidden dark:block"
					/>
					<div className="text-lg md:text-xl lg:text-2xl">GeMorph</div>
				</div>
			</Link>

			{/* Right-side buttons + theme toggle */}
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleTheme}
					aria-pressed={theme === "dark"}
					className="!active:scale-100 focus:!ring-0 transition-none relative overflow-hidden"
				>
					<AnimatePresence mode="wait" initial={false}>
						{theme === "light" ? (
							<motion.div
								key="moon"
								initial={{ opacity: 0, rotate: -90 }}
								animate={{ opacity: 1, rotate: 0 }}
								exit={{ opacity: 0, rotate: 90 }}
								transition={{ duration: 0.2 }}
								className="absolute inset-0 flex items-center justify-center"
							>
								<Moon className="w-4 h-4" />
							</motion.div>
						) : (
							<motion.div
								key="sun"
								initial={{ opacity: 0, rotate: 90 }}
								animate={{ opacity: 1, rotate: 0 }}
								exit={{ opacity: 0, rotate: -90 }}
								transition={{ duration: 0.2 }}
								className="absolute inset-0 flex items-center justify-center"
							>
								<Sun className="w-4 h-4" />
							</motion.div>
						)}
					</AnimatePresence>
				</Button>

				{user ? (
					<>
						{/* Mobile Menu */}
						<div className="lg:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon">
										<GiHamburgerMenu className="w-5 h-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right">
									<SheetHeader>
										<SheetTitle>Menu</SheetTitle>
									</SheetHeader>
									<div className="flex flex-col gap-4 mt-8">
										<Button
											variant="ghost"
											className="w-full justify-start"
											onClick={() => handleNavigation("/dashboard")}
										>
											Dashboard
										</Button>
										<Button
											variant="ghost"
											className="w-full justify-start"
											onClick={() => handleNavigation("/submit-case")}
										>
											Submit Case
										</Button>
										<Button
											variant="ghost"
											className="w-full justify-start"
											onClick={() => handleNavigation("/reports")}
										>
											Reports
										</Button>
										<Button
											variant="ghost"
											className="w-full justify-start text-red-500"
											onClick={handleSignOut}
										>
											Sign Out
										</Button>
									</div>
								</SheetContent>
							</Sheet>
						</div>

						{/* Desktop Menu */}
						<div className="hidden lg:flex items-center gap-4">
							<Button
								variant="ghost"
								onClick={() => handleNavigation("/dashboard/submit-case")}
							>
								Submit Case
							</Button>
							<Button
								variant="ghost"
								className="text-red-500"
								onClick={handleSignOut}
							>
								<LogOut className="w-4 h-4 mr-2" />
								Sign Out
							</Button>
						</div>
					</>
				) : (
					<>
						{/* Mobile Menu for Non-Authenticated Users */}
						<div className="lg:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon">
										<GiHamburgerMenu className="w-5 h-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right">
									<SheetHeader>
										<SheetTitle>Menu</SheetTitle>
									</SheetHeader>
									<div className="flex flex-col gap-4 mt-8">
										<Button
											variant="ghost"
											className="w-full justify-start"
											onClick={() => handleNavigation("/login")}
										>
											Login
										</Button>
										<Button
											variant="ghost"
											className="w-full justify-start"
											onClick={() => handleNavigation("/signup")}
										>
											Sign Up
										</Button>
									</div>
								</SheetContent>
							</Sheet>
						</div>

						{/* Desktop Menu for Non-Authenticated Users */}
						<div className="hidden lg:flex items-center gap-2">
							<Button
								variant="outline"
								className="font-medium"
								onClick={() => handleNavigation("/signup")}
							>
								Sign Up
							</Button>
							<Button
								className="font-medium"
								onClick={() => handleNavigation("/login")}
							>
								Login
							</Button>
						</div>
					</>
				)}
			</div>
		</header>
	);
};
