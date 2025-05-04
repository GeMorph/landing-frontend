import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	const location = useLocation();

	const navItems = [
		{
			title: "Cases",
			href: "/dashboard",
			icon: "📑",
		},
		{
			title: "Reports",
			href: "/dashboard/reports",
			icon: "📊",
		},
	];

	return (
		<div className="flex h-[calc(100vh-4rem)] bg-background">
			{/* Sidebar - hidden on mobile, shown on desktop */}
			<aside className="hidden border-r bg-white md:block md:w-[240px]">
				<div className="p-3">
					<h2 className="mb-2 px-2 text-lg font-semibold">Dashboard</h2>
					<nav>
						{navItems.map((item) => (
							<Link
								key={item.href}
								to={item.href}
								className={cn(
									"mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100",
									location.pathname === item.href && "bg-gray-50"
								)}
							>
								<span className="text-base">{item.icon}</span>
								<span>{item.title}</span>
							</Link>
						))}
					</nav>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1 p-6 md:px-12">{children}</main>
		</div>
	);
};
