import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Header = () => {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const hamburgerRef = useRef<HTMLSpanElement>(null);

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

	// Close dropdown if clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!hamburgerRef.current?.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen]);

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
			{/* Navigation for lg and xl */}
			<nav className="hidden lg:flex space-x-6 text-sm font-medium">
				<a href="#about" className="font-medium">
					About
				</a>
				<a href="#services" className="font-medium">
					Services
				</a>
				<a href="#contact" className="font-medium">
					Contact
				</a>
			</nav>

			{/* Right-side buttons + theme toggle for lg and xl */}
			<div className="hidden lg:flex items-center gap-2">
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

				<Button
					variant="outline"
					className="font-medium "
					onClick={() => navigate({ to: "/signup" })}
				>
					Signup
				</Button>
				<Button
					className="font-medium"
					onClick={() => navigate({ to: "/login" })}
				>
					Login
				</Button>
			</div>

			{/* Mobile / Tablet Section */}
			<div className="lg:hidden flex items-center gap-2">
				{/* Theme Toggle Always Visible */}
				<Button variant="ghost" size="icon" onClick={toggleTheme}>
					{theme === "light" ? (
						<Moon className="w-4 h-4" />
					) : (
						<Sun className="w-4 h-4" />
					)}
				</Button>

				{/* Hamburger Menu Icon */}
				<span ref={hamburgerRef}>
					<GiHamburgerMenu
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="text-2xl cursor-pointer"
					/>
				</span>

				{/* Dropdown Menu */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							key="dropdown"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="text-xs md:text-sm absolute top-16 right-6 bg-popover text-popover-foreground shadow-lg rounded-md py-2 px-4 w-48 z-50"
						>
							<a href="#" className="block py-2 font-medium">
								About
							</a>
							<a href="#" className="block py-2 font-medium">
								Services
							</a>
							<a href="#" className="block py-2 font-medium">
								Contact
							</a>
							<div className="border-t mt-2">
								<a href="#" className="block py-2 font-medium">
									Signup
								</a>
								<a href="#" className="block py-2 font-medium">
									Login
								</a>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
};
