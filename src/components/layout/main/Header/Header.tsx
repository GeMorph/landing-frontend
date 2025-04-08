import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sun, Moon } from "lucide-react"; // Icons for theme toggle

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");

	// On mount, check the saved theme or system preference
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

	return (
		<header className="flex items-center justify-between px-6 py-2 border-b bg-background text-foreground font-inter relative">
			{/* Logo */}
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

			{/* Navigation for lg and xl */}
			<nav className="hidden lg:flex space-x-6 text-sm font-medium">
				<a href="#" className="font-medium">
					About
				</a>
				<a href="#" className="font-medium">
					Services
				</a>
				<a href="#" className="font-medium">
					Contact
				</a>
			</nav>

			{/* Right-side buttons + theme toggle for lg and xl */}
			<div className="hidden lg:flex items-center gap-2">
				<Button variant="ghost" onClick={toggleTheme}>
					{theme === "light" ? (
						<Moon className="w-4 h-4" />
					) : (
						<Sun className="w-4 h-4" />
					)}
				</Button>
				<Button variant="outline" className="font-medium">
					Signup
				</Button>
				<Button className="font-medium">Login</Button>
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
				<GiHamburgerMenu
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="text-2xl cursor-pointer"
				/>

				{/* Dropdown Menu */}
				{isMenuOpen && (
					<div className="text-xs md:text-sm absolute top-16 right-6 bg-popover text-popover-foreground shadow-lg rounded-md py-2 px-4 w-48 z-50">
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
					</div>
				)}
			</div>
		</header>
	);
};
