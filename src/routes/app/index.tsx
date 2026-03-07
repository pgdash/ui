import {
  Activity01Icon,
  ActivityIcon,
  AiBrain01Icon,
  Alert01Icon,
  ArrowDataTransferHorizontalIcon,
  ArrowRight01Icon,
  ChartLineData01Icon,
  Clock01Icon,
  ComputerTerminalIcon,
  Database01Icon,
  DatabaseSettingIcon,
  FolderLibraryIcon,
  GridViewIcon,
  MoreVerticalIcon,
  PlayIcon,
  PlusSignIcon,
  RefreshIcon,
  Search01Icon,
  Settings01Icon,
  ShieldUserIcon,
  SparklesIcon,
  TableIcon,
  UserGroupIcon,
  UserWarningIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({ component: AppDashboard });

// ─── Mock data ───────────────────────────────────────────────────────────────

const queryThroughputData = [
  { time: "00:00", qps: 142 },
  { time: "02:00", qps: 89 },
  { time: "04:00", qps: 54 },
  { time: "06:00", qps: 78 },
  { time: "08:00", qps: 245 },
  { time: "10:00", qps: 412 },
  { time: "12:00", qps: 538 },
  { time: "14:00", qps: 621 },
  { time: "16:00", qps: 489 },
  { time: "18:00", qps: 395 },
  { time: "20:00", qps: 287 },
  { time: "22:00", qps: 198 },
];

const cacheHitData = [
  { time: "00:00", hit: 94.2 },
  { time: "02:00", hit: 91.8 },
  { time: "04:00", hit: 95.1 },
  { time: "06:00", hit: 92.3 },
  { time: "08:00", hit: 87.5 },
  { time: "10:00", hit: 89.2 },
  { time: "12:00", hit: 91.4 },
  { time: "14:00", hit: 93.7 },
  { time: "16:00", hit: 90.8 },
  { time: "18:00", hit: 94.5 },
  { time: "20:00", hit: 96.1 },
  { time: "22:00", hit: 95.3 },
];

const tableActivityData = [
  { table: "users", reads: 12483, writes: 843 },
  { table: "orders", reads: 8921, writes: 2341 },
  { table: "products", reads: 6745, writes: 127 },
  { table: "sessions", reads: 19823, writes: 18234 },
  { table: "audit_log", reads: 342, writes: 4821 },
];

const recentAlerts = [
  {
    id: 1,
    severity: "critical",
    message: "Replication lag > 5s on replica-02",
    time: "2m ago",
  },
  {
    id: 2,
    severity: "warning",
    message: "Index bloat detected on orders_idx",
    time: "18m ago",
  },
  {
    id: 3,
    severity: "warning",
    message: "Long-running query (>30s) by user analytics",
    time: "34m ago",
  },
  {
    id: 4,
    severity: "info",
    message: "Autovacuum completed on sessions table",
    time: "1h ago",
  },
];

const quickActions = [
  { label: "New Query", icon: ComputerTerminalIcon, color: "text-primary" },
  { label: "Explore Tables", icon: TableIcon, color: "text-chart-2" },
  { label: "Schema Diagram", icon: GridViewIcon, color: "text-chart-3" },
  { label: "AI Assistant", icon: AiBrain01Icon, color: "text-chart-4" },
  { label: "Run Analysis", icon: ChartLineData01Icon, color: "text-chart-5" },
  { label: "Create Trigger", icon: ActivityIcon, color: "text-destructive" },
];

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
];

const throughputConfig = {
  qps: { label: "Queries/sec", color: "var(--primary)" },
};

const cacheConfig = {
  hit: { label: "Cache Hit %", color: "var(--chart-2)" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  colorClass = "text-primary",
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  colorClass?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-muted-foreground">{label}</span>
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-md bg-muted",
              colorClass,
            )}
          >
            <HugeiconsIcon icon={Icon} size={14} strokeWidth={2} />
          </span>
        </CardTitle>
        <CardAction>
          {trend && (
            <Badge
              variant={
                trend === "up"
                  ? "default"
                  : trend === "down"
                    ? "destructive"
                    : "secondary"
              }
              className="text-[10px]"
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "~"}
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold font-display tracking-tight">
          {value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function AlertRow({ alert }: { alert: (typeof recentAlerts)[0]; }) {
  const colorMap = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span
        className={cn(
          "mt-0.5 shrink-0 rounded-full p-1 border text-[10px] font-bold uppercase",
          colorMap[alert.severity as keyof typeof colorMap],
        )}
      >
        <HugeiconsIcon
          icon={alert.severity === "critical" ? UserWarningIcon : Alert01Icon}
          size={10}
          strokeWidth={2}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs">{alert.message}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{alert.time}</p>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

function AppDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* ── Sidebar ── */}
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarHeader className="gap-0 py-3">
            <div className="flex items-center gap-2.5 px-2">
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
            <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/40 px-2 py-1.5 group-data-[state=collapsed]:hidden">
              <span className="size-1.5 shrink-0 rounded-full bg-green-500 shadow-[0_0_6px_2px_#22c55e60]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium">
                  prod-primary.cluster
                </p>
                <p className="text-[9px] text-muted-foreground">
                  PostgreSQL 16
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="mt-1">
            {navSections.map((section) => (
              <SidebarGroup key={section.label}>
                <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          isActive={activeNav === item.label}
                          tooltip={item.label}
                          onClick={() => setActiveNav(item.label)}
                          render={<Link to={item.to} />}
                        >
                          <HugeiconsIcon
                            icon={item.icon}
                            size={15}
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

          <SidebarFooter>
            <Separator className="bg-sidebar-border" />
            <div className="flex items-center gap-2 px-2 py-1">
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
        </Sidebar>

        {/* ── Main Content ── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* ── Top Header ── */}
          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur">
            <SidebarTrigger className="shrink-0" />
            <Separator orientation="vertical" className="h-4" />

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>pgdash</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={10}
                strokeWidth={2}
              />
              <span className="font-medium text-foreground">{activeNav}</span>
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
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white">
                  3
                </span>
              </Button>

              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon icon={RefreshIcon} size={15} strokeWidth={2} />
              </Button>

              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon
                  icon={MoreVerticalIcon}
                  size={15}
                  strokeWidth={2}
                />
              </Button>
            </div>
          </header>

          {/* ── Scrollable Body ── */}
          <ScrollArea className="flex-1">
            <div className="p-5 space-y-5">
              {/* Page title */}
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="font-display text-lg font-semibold tracking-tight">
                    Overview
                  </h1>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    All metrics are live-updated every 30s
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_6px_2px_#22c55e55]" />
                  Connected · Last refresh{" "}
                  <HugeiconsIcon icon={Clock01Icon} size={10} strokeWidth={2} />{" "}
                  just now
                </div>
              </div>

              {/* ── Metric panels ── */}
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Query Throughput"
                  value="621 qps"
                  sub="Peak today at 14:00"
                  icon={ChartLineData01Icon}
                  trend="up"
                  colorClass="text-primary"
                />
                <MetricCard
                  label="Cache Hit Rate"
                  value="94.2%"
                  sub="Buffer cache efficiency"
                  icon={Activity01Icon}
                  trend="up"
                  colorClass="text-chart-2"
                />
                <MetricCard
                  label="Active Connections"
                  value="38 / 100"
                  sub="Connection pool usage"
                  icon={UserGroupIcon}
                  trend="neutral"
                  colorClass="text-chart-3"
                />
                <MetricCard
                  label="Avg Query Latency"
                  value="4.2 ms"
                  sub="+0.8ms vs yesterday"
                  icon={Clock01Icon}
                  trend="down"
                  colorClass="text-chart-4"
                />
              </div>

              {/* ── Charts row ── */}
              <div className="grid gap-3 lg:grid-cols-2">
                {/* Throughput chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Query Throughput (24h)</CardTitle>
                    <CardDescription>
                      Queries per second over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={throughputConfig}
                      className="h-48 w-full"
                    >
                      <AreaChart
                        data={queryThroughputData}
                        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                      >
                        <defs>
                          <linearGradient
                            id="throughputGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--primary)"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--primary)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{
                            fontSize: 10,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 10,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="qps"
                          stroke="var(--primary)"
                          strokeWidth={1.5}
                          fill="url(#throughputGradient)"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Cache hit chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cache Hit Rate (24h)</CardTitle>
                    <CardDescription>Buffer cache efficiency %</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={cacheConfig}
                      className="h-48 w-full"
                    >
                      <AreaChart
                        data={cacheHitData}
                        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                      >
                        <defs>
                          <linearGradient
                            id="cacheGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--chart-2)"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--chart-2)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{
                            fontSize: 10,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[80, 100]}
                          tick={{
                            fontSize: 10,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="hit"
                          stroke="var(--chart-2)"
                          strokeWidth={1.5}
                          fill="url(#cacheGradient)"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* ── Bottom 3-col row ── */}
              <div className="grid gap-3 lg:grid-cols-3">
                {/* Table Activity */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Top Table Activity</CardTitle>
                    <CardDescription>Read/write ops in last 1h</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        reads: { label: "Reads", color: "var(--primary)" },
                        writes: { label: "Writes", color: "var(--chart-2)" },
                      }}
                      className="h-[180px] w-full"
                    >
                      <BarChart
                        data={tableActivityData}
                        layout="vertical"
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        barSize={6}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{
                            fontSize: 9,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="table"
                          width={56}
                          tick={{
                            fontSize: 9,
                            fill: "var(--muted-foreground)",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            fontSize: 11,
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                          }}
                        />
                        <Bar
                          dataKey="reads"
                          fill="var(--primary)"
                          radius={[0, 3, 3, 0]}
                        />
                        <Bar
                          dataKey="writes"
                          fill="var(--chart-2)"
                          radius={[0, 3, 3, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Alerts feed */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Alerts
                      <Badge variant="destructive" className="text-[9px]">
                        {
                          recentAlerts.filter((a) => a.severity !== "info")
                            .length
                        }
                      </Badge>
                    </CardTitle>
                    <CardDescription>Recent detected events</CardDescription>
                    <CardAction>
                      <Button variant="ghost" size="icon-xs">
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={12}
                          strokeWidth={2}
                        />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border">
                      {recentAlerts.map((alert) => (
                        <AlertRow key={alert.id} alert={alert} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* DB Health + Quick Actions */}
                <div className="flex flex-col gap-3">
                  {/* DB Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Database Health</CardTitle>
                      <CardDescription>Current resource usage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          label: "CPU",
                          value: 42,
                          color: "bg-primary",
                          display: "42%",
                        },
                        {
                          label: "Memory",
                          value: 68,
                          color: "bg-chart-2",
                          display: "68%",
                        },
                        {
                          label: "Disk I/O",
                          value: 27,
                          color: "bg-chart-3",
                          display: "27%",
                        },
                        {
                          label: "Connections",
                          value: 38,
                          color: "bg-chart-4",
                          display: "38 / 100",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex justify-between text-[10px]">
                            <span className="text-muted-foreground">
                              {item.label}
                            </span>
                            <span className="font-medium">{item.display}</span>
                          </div>
                          <Progress value={item.value} className="h-1.5" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {quickActions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            className="group flex flex-col items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-2.5 text-center transition hover:border-primary/40 hover:bg-primary/5"
                          >
                            <span
                              className={cn(
                                "flex size-7 items-center justify-center rounded-md bg-muted transition group-hover:scale-110",
                                action.color,
                              )}
                            >
                              <HugeiconsIcon
                                icon={action.icon}
                                size={13}
                                strokeWidth={2}
                              />
                            </span>
                            <span className="text-[9px] font-medium leading-tight text-muted-foreground group-hover:text-foreground">
                              {action.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* ── Recent Queries ── */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Queries</CardTitle>
                  <CardDescription>
                    Latest executed statements from all sessions
                  </CardDescription>
                  <CardAction>
                    <Button variant="outline" size="sm" className="gap-1">
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        size={11}
                        strokeWidth={2}
                      />
                      New Query
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          {["Query", "Duration", "Rows", "User", "Status"].map(
                            (h) => (
                              <th
                                key={h}
                                className="pb-2 pr-4 text-left font-medium text-muted-foreground last:pr-0"
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            query:
                              "SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '1 day'",
                            duration: "2.4ms",
                            rows: "1 243",
                            user: "analytics",
                            status: "ok",
                          },
                          {
                            query:
                              "UPDATE sessions SET last_seen = NOW() WHERE user_id = $1",
                            duration: "0.8ms",
                            rows: "1",
                            user: "app",
                            status: "ok",
                          },
                          {
                            query:
                              "SELECT pg_size_pretty(pg_total_relation_size('orders'))",
                            duration: "1.1ms",
                            rows: "1",
                            user: "admin",
                            status: "ok",
                          },
                          {
                            query:
                              "WITH cte AS (SELECT id, rank() OVER (PARTITION BY category ORDER BY score DESC) r FROM products) SELECT * FROM cte WHERE r <= 10",
                            duration: "34.2ms",
                            rows: "120",
                            user: "analytics",
                            status: "slow",
                          },
                          {
                            query:
                              "INSERT INTO audit_log (event, actor, payload) VALUES ($1, $2, $3)",
                            duration: "0.5ms",
                            rows: "1",
                            user: "app",
                            status: "ok",
                          },
                        ].map((row) => (
                          <tr
                            key={row.query}
                            className="group border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                          >
                            <td className="max-w-xs py-2 pr-4">
                              <code className="truncate block font-mono text-[10px] text-foreground/80">
                                {row.query}
                              </code>
                            </td>
                            <td className="py-2 pr-4 font-mono tabular-nums">
                              {row.duration}
                            </td>
                            <td className="py-2 pr-4 tabular-nums">
                              {row.rows}
                            </td>
                            <td className="py-2 pr-4">
                              <span className="flex items-center gap-1">
                                <HugeiconsIcon
                                  icon={ShieldUserIcon}
                                  size={10}
                                  strokeWidth={2}
                                  className="text-muted-foreground"
                                />
                                {row.user}
                              </span>
                            </td>
                            <td className="py-2">
                              <Badge
                                variant={
                                  row.status === "ok"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-[9px]"
                              >
                                {row.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}
