import {
	Activity01Icon,
	ActivityIcon,
	Alert01Icon,
	ArrowDataTransferHorizontalIcon,
	ArrowRight01Icon,
	ComputerTerminalIcon,
	Database01Icon,
	DatabaseSettingIcon,
	FolderLibraryIcon,
	GridViewIcon,
	MoreVerticalIcon,
	PlayIcon,
	RefreshIcon,
	Search01Icon,
	Settings01Icon,
	SparklesIcon,
	TableIcon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router"
import ThemeToggle from "@/components/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"

export const Route = createFileRoute("/app")({ component: AppLayout })

// ─── Nav definition ──────────────────────────────────────────────────────────

const navSections = [
	{
		label: "Explore",
		items: [
			{ label: "Dashboard", icon: GridViewIcon, to: "/app" },
			{ label: "Tables", icon: TableIcon, to: "/app/tables" },
			{ label: "Data Explorer", icon: FolderLibraryIcon, to: "/app/data" },
			{ label: "Query Runner", icon: ComputerTerminalIcon, to: "/app/queries" },
			{ label: "Schema Diagram", icon: DatabaseSettingIcon, to: "/app/schema" },
		],
	},
	{
		label: "Manage",
		items: [
			{ label: "Functions", icon: PlayIcon, to: "/app/functions" },
			{ label: "Triggers", icon: ActivityIcon, to: "/app/triggers" },
			{ label: "Roles & Users", icon: UserGroupIcon, to: "/app/roles" },
			{
				label: "Replication",
				icon: ArrowDataTransferHorizontalIcon,
				to: "/app/replication",
			},
		],
	},
	{
		label: "Observability",
		items: [
			{ label: "Metrics", icon: Activity01Icon, to: "/app/metrics" },
			{ label: "Alerts", icon: Alert01Icon, to: "/app/alerts", badge: 3 },
			{ label: "AI Agents", icon: SparklesIcon, to: "/app/agents" },
		],
	},
]

const allNavItems = navSections.flatMap((s) => s.items)

// ─── Layout ───────────────────────────────────────────────────────────────────

function AppLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname })

	// Best-matching nav item for the current URL
	const activeItem =
		allNavItems.find((item) => item.to === pathname) ??
		allNavItems.find(
			(item) => pathname.startsWith(item.to) && item.to !== "/app",
		) ??
		allNavItems[0]

	return (
		<SidebarProvider defaultOpen={false}>
			<div className="flex h-screen w-full overflow-hidden bg-background">
				{/* ── Sidebar ── */}
				<Sidebar
					collapsible="icon"
					variant="sidebar"
					className="border-l border-sidebar-border"
				>
					<div className="flex flex-col justify-between h-full ">
						<span>
							<SidebarHeader className="gap-0 py-3">
								<div className="flex items-center gap-2.5 ">
									<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow">
										<HugeiconsIcon
											icon={Database01Icon}
											size={14}
											strokeWidth={2.5}
										/>
									</div>
									<span className="font-display text-sm font-semibold tracking-tight group-data-[state=collapsed]:hidden">
										pgdash
									</span>
									<Badge
										variant="secondary"
										className="ml-auto text-[9px] group-data-[state=collapsed]:hidden"
									>
										v0.1
									</Badge>
								</div>

								<Separator className="mt-3 bg-sidebar-border" />

								{/* DB connection pill */}
								<DropdownMenu>
									<DropdownMenuTrigger className="mt-2 flex w-full items-center gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-left outline-none hover:bg-muted/60 focus:bg-muted/60 focus:ring-1 focus:ring-ring group-data-[state=collapsed]:hidden transition">
										<span className="size-1.5 shrink-0 rounded-full bg-chart-2" />
										<div className="min-w-0 flex-1">
											<p className="truncate text-[10px] font-medium">
												prod-primary.cluster
											</p>
											<p className="text-[9px] text-muted-foreground">
												PostgreSQL 16
											</p>
										</div>
										<HugeiconsIcon
											icon={MoreVerticalIcon}
											size={12}
											className="text-muted-foreground"
										/>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56" align="start">
										<DropdownMenuGroup>
											<DropdownMenuLabel className="text-xs">
												Postgres Instances
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem className="gap-2 text-xs">
												<span className="size-1.5 shrink-0 rounded-full bg-chart-2" />
												<div className="flex flex-col">
													<span className="font-medium">
														prod-primary.cluster
													</span>
													<span className="text-[9px] text-muted-foreground">
														PostgreSQL 16
													</span>
												</div>
											</DropdownMenuItem>
											<DropdownMenuItem className="gap-2 text-xs">
												<span className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />
												<div className="flex flex-col">
													<span className="font-medium">staging.cluster</span>
													<span className="text-[9px] text-muted-foreground">
														PostgreSQL 15
													</span>
												</div>
											</DropdownMenuItem>
											<DropdownMenuItem className="gap-2 text-xs">
												<span className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />
												<div className="flex flex-col">
													<span className="font-medium">dev.local</span>
													<span className="text-[9px] text-muted-foreground">
														PostgreSQL 16
													</span>
												</div>
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarHeader>

							<ScrollArea className="overflow-auto">
								<SidebarContent className="mt-1">
									{navSections.map((section) => (
										<SidebarGroup key={section.label}>
											<SidebarGroupLabel>{section.label}</SidebarGroupLabel>
											<SidebarGroupContent>
												<SidebarMenu className="gap-2">
													{section.items.map((item) => (
														<SidebarMenuItem key={item.label}>
															<SidebarMenuButton
																size="sm"
																isActive={activeItem.label === item.label}
																tooltip={item.label}
																render={<Link to={item.to} />}
															>
																<HugeiconsIcon
																	icon={item.icon}
																	strokeWidth={2}
																/>
																<span>{item.label}</span>
																{"badge" in item && item.badge ? (
																	<Badge
																		variant="destructive"
																		className="ml-auto h-4 min-w-4 px-1 text-[9px] group-data-[collapsible=icon]:hidden"
																	>
																		{item.badge}
																	</Badge>
																) : null}
															</SidebarMenuButton>
														</SidebarMenuItem>
													))}
												</SidebarMenu>
											</SidebarGroupContent>
										</SidebarGroup>
									))}
								</SidebarContent>
							</ScrollArea>
						</span>

						<SidebarFooter>
							<Separator className="bg-sidebar-border" />
							<div className="flex items-center gap-2">
								<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
									A
								</div>
								<div className="min-w-0 flex-1 group-data-[state=collapsed]:hidden">
									<p className="text-[10px] font-medium">Admin</p>
									<p className="text-[9px] text-muted-foreground">
										admin@pgdash.io
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon-xs"
									className="shrink-0 group-data-[state=collapsed]:hidden"
								>
									<HugeiconsIcon
										icon={Settings01Icon}
										size={12}
										strokeWidth={2}
									/>
								</Button>
							</div>
						</SidebarFooter>
					</div>
				</Sidebar>

				{/* ── Main Content ── */}
				<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
					{/* ── Top Header ── */}
					<header className="flex shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur">
						<SidebarTrigger className="shrink-0" />

						{/* Breadcrumb */}
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<span>pgdash</span>
							<HugeiconsIcon
								icon={ArrowRight01Icon}
								size={10}
								strokeWidth={2}
							/>
							<span className="font-medium text-foreground">
								{activeItem.label}
							</span>
						</div>

						<div className="ml-auto flex items-center gap-2">
							{/* Search */}
							<div className="relative hidden sm:block">
								<HugeiconsIcon
									icon={Search01Icon}
									size={13}
									strokeWidth={2}
									className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
								/>
								<input
									placeholder="Search tables, queries…"
									className="h-7 w-52 rounded-md border border-border bg-muted/40 pl-7 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/30 transition"
								/>
							</div>

							{/* AI pill */}
							<Button size="sm" className="gap-1.5 h-7">
								<HugeiconsIcon icon={SparklesIcon} size={12} strokeWidth={2} />
								Ask AI
							</Button>

							{/* Alerts badge */}
							<Button variant="ghost" size="icon-sm" className="relative">
								<HugeiconsIcon icon={Alert01Icon} size={15} strokeWidth={2} />
								<span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
									3
								</span>
							</Button>

							<Button variant="ghost" size="icon-sm">
								<HugeiconsIcon icon={RefreshIcon} size={15} strokeWidth={2} />
							</Button>

							{/* Theme switcher */}
							<ThemeToggle />

							<Button variant="ghost" size="icon-sm">
								<HugeiconsIcon
									icon={MoreVerticalIcon}
									size={15}
									strokeWidth={2}
								/>
							</Button>
						</div>
					</header>

					{/* ── Child route renders here ── */}
					<Outlet />
				</div>
			</div>
		</SidebarProvider>
	)
}
