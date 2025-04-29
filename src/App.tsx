// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner"; // ✅ Add this line
import type { FunctionComponent } from "./common/types";
import { AuthProvider } from "./hooks/useAuth";
import { router } from "./main";

const queryClient = new QueryClient();

type AppProps = {
	router: typeof router;
};

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Toaster position="top-right" richColors /> {/* ✅ Global Toaster */}
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default App;
