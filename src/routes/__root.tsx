import { TanStackDevtools } from "@tanstack/react-devtools"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import "@/styles/index.css"
import { TooltipProvider } from "#/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/query/query-client"

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<TooltipProvider>
						<Outlet />
						<Toaster />
					</TooltipProvider>
				</ThemeProvider>
			</QueryClientProvider>
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
					{
						name: "Tantack Query",
						render: <ReactQueryDevtoolsPanel client={queryClient} />,
					},
				]}
			/>
		</>
	)
}
