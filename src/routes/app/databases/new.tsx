import { zodResolver } from "@hookform/resolvers/zod"
import {
	Database01Icon,
	ServerStack01Icon,
	ShieldKeyIcon,
	UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export const Route = createFileRoute("/app/databases/new")({
	component: AddDatabasePage,
})

// ─── Schema ─────────────────────────────────────────────────────────────────

const addDatabaseSchema = z.object({
	name: z
		.string()
		.min(1, "A connection name is required")
		.max(64, "Name must be 64 characters or less"),
	host: z.string().min(1, "Host is required"),
	port: z.coerce
		.number()
		.int()
		.min(1, "Port must be at least 1")
		.max(65535, "Port must be 65535 or less")
		.default(5432),
	db_name: z.string().min(1, "Database name is required"),
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
	ssl: z.boolean().default(false),
})

type AddDatabaseValues = z.infer<typeof addDatabaseSchema>

// ─── Page ───────────────────────────────────────────────────────────────────

function AddDatabasePage() {
	const form = useForm<AddDatabaseValues>({
		resolver: zodResolver(addDatabaseSchema),
		defaultValues: {
			name: "",
			host: "",
			port: 5432,
			db_name: "",
			username: "",
			password: "",
			ssl: false,
		},
	})

	function onSubmit(values: AddDatabaseValues) {
		// TODO: wire up to API
		console.log("Add database payload:", values)
	}

	return (
		<div className="flex flex-1 items-start justify-center overflow-y-auto p-6 md:p-10">
			<div className="w-full max-w-2xl space-y-6">
				{/* ── Page heading ── */}
				<div className="space-y-1">
					<h1 className="text-lg font-semibold tracking-tight">
						Add Database Connection
					</h1>
					<p className="text-xs text-muted-foreground">
						Enter the connection details for your PostgreSQL database.
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* ── Connection Info ── */}
						<Card>
							<CardHeader className="border-b">
								<CardTitle className="flex items-center gap-2">
									<HugeiconsIcon
										icon={Database01Icon}
										size={15}
										strokeWidth={2}
										className="text-muted-foreground"
									/>
									Connection Details
								</CardTitle>
								<CardDescription>
									Provide a friendly name and the host information for your
									database.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-5">
								{/* Connection name */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Connection Name</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. Production Primary"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												A friendly label to identify this connection.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Host + Port */}
								<div className="grid gap-4 sm:grid-cols-[1fr_120px]">
									<FormField
										control={form.control}
										name="host"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Host</FormLabel>
												<FormControl>
													<Input placeholder="db.example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="port"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Port</FormLabel>
												<FormControl>
													<Input type="number" placeholder="5432" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Database name */}
								<FormField
									control={form.control}
									name="db_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Database Name</FormLabel>
											<FormControl>
												<Input placeholder="postgres" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* ── Authentication ── */}
						<Card>
							<CardHeader className="border-b">
								<CardTitle className="flex items-center gap-2">
									<HugeiconsIcon
										icon={UserIcon}
										size={15}
										strokeWidth={2}
										className="text-muted-foreground"
									/>
									Authentication
								</CardTitle>
								<CardDescription>
									Credentials used to authenticate with the database.
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-5">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input
													placeholder="postgres"
													autoComplete="off"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													autoComplete="off"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* ── Security ── */}
						<Card>
							<CardHeader className="border-b">
								<CardTitle className="flex items-center gap-2">
									<HugeiconsIcon
										icon={ShieldKeyIcon}
										size={15}
										strokeWidth={2}
										className="text-muted-foreground"
									/>
									Security
								</CardTitle>
								<CardDescription>
									Configure SSL for encrypted connections.
								</CardDescription>
							</CardHeader>

							<CardContent>
								<FormField
									control={form.control}
									name="ssl"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between gap-4">
											<div className="space-y-1">
												<FormLabel>Enable SSL</FormLabel>
												<FormDescription>
													Use TLS/SSL to encrypt the connection to the database
													server.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* ── Actions ── */}
						<div className="flex items-center justify-end gap-3 pt-2">
							<Button type="button" variant="outline" size="sm" asChild>
								<Link to="/app">Cancel</Link>
							</Button>
							<Button type="submit" size="sm">
								<HugeiconsIcon
									icon={ServerStack01Icon}
									size={14}
									strokeWidth={2}
								/>
								Add Connection
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}
