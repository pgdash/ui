import {
	Database01Icon,
	Folder01Icon,
	FunctionIcon,
	GridIcon,
	ListViewIcon,
	TableIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

// Mock Data Load (For development)
import mockSchemaRaw from "@/../testdata/dvdrental.json"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PGDatabase, PGSchema, PGTable } from "@/types/database"

export const Route = createFileRoute("/app/tables/")({
	component: SchemaViewer,
})

// Cast to our generated types
const mockDatabase = mockSchemaRaw as unknown as PGDatabase

type SelectionItem =
	| { type: "schema"; data: PGSchema }
	| { type: "table"; schemaName: string; data: PGTable }
	// biome-ignore lint/suspicious/noExplicitAny: wip
	| { type: "view"; schemaName: string; data: any }
	// biome-ignore lint/suspicious/noExplicitAny: wip
	| { type: "enum"; schemaName: string; data: any }
	// biome-ignore lint/suspicious/noExplicitAny: wip
	| { type: "function"; schemaName: string; data: any }

function SchemaViewer() {
	// For right now, explicitly select the first schema (public) so there is a default view
	const defaultSchema = mockDatabase.schemas[0]
	const [selectedItem, setSelectedItem] = useState<SelectionItem>({
		type: "schema",
		data: defaultSchema,
	})

	const [expandedSchemas, setExpandedSchemas] = useState<
		Record<string, boolean>
	>({
		[defaultSchema.name]: true,
	})

	const toggleSchema = (schemaName: string) => {
		setExpandedSchemas((prev) => ({
			...prev,
			[schemaName]: !prev[schemaName],
		}))
	}

	return (
		<div className="flex h-full w-full overflow-hidden">
			{/* ── Left Sidebar (Schema Explorer) ── */}
			<div className="flex w-64 flex-col border-r bg-muted/20">
				<div className="flex h-12 items-center border-b px-4">
					<h2 className="flex items-center gap-2 font-display text-sm font-semibold">
						<HugeiconsIcon icon={Database01Icon} size={16} />
						{mockDatabase.name}
					</h2>
				</div>

				<ScrollArea className="flex-1">
					<div className="flex flex-col gap-1 p-2">
						{mockDatabase.schemas.map((schema) => {
							const isExpanded = expandedSchemas[schema.name]
							const isSchemaSelected =
								selectedItem.type === "schema" &&
								selectedItem.data.name === schema.name

							return (
								<div key={schema.name} className="flex flex-col">
									{/* Schema Folder Toggle */}
									<button
										onClick={() => {
											toggleSchema(schema.name)
											setSelectedItem({ type: "schema", data: schema })
										}}
										className={cn(
											"flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50",
											isSchemaSelected && "bg-muted text-primary",
										)}
									>
										<HugeiconsIcon
											icon={Folder01Icon}
											size={14}
											className={
												isExpanded ? "text-primary" : "text-muted-foreground"
											}
										/>
										<span className="truncate">{schema.name}</span>
									</button>

									{/* Children (Tables, Views, Enums, etc.) */}
									{isExpanded && (
										<div className="ml-4 mt-1 flex flex-col gap-0.5 border-l pl-2">
											{schema.tables.map((table) => {
												const isTableSelected =
													selectedItem.type === "table" &&
													selectedItem.data.name === table.name
												return (
													<button
														key={`table-${table.name}`}
														onClick={() =>
															setSelectedItem({
																type: "table",
																schemaName: schema.name,
																data: table,
															})
														}
														className={cn(
															"flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50 text-muted-foreground",
															isTableSelected &&
																"bg-muted text-foreground font-medium",
														)}
													>
														<HugeiconsIcon
															icon={TableIcon}
															size={12}
															className="shrink-0"
														/>
														<span className="truncate">{table.name}</span>
													</button>
												)
											})}
											{schema.views.map((view) => {
												const isViewSelected =
													selectedItem.type === "view" &&
													selectedItem.data.name === view.name
												return (
													<button
														key={`view-${view.name}`}
														onClick={() =>
															setSelectedItem({
																type: "view",
																schemaName: schema.name,
																data: view,
															})
														}
														className={cn(
															"flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50 text-muted-foreground",
															isViewSelected &&
																"bg-muted text-foreground font-medium",
														)}
													>
														<HugeiconsIcon
															icon={ListViewIcon}
															size={12}
															className="shrink-0"
														/>
														<span className="truncate">{view.name}</span>
													</button>
												)
											})}
											{schema.enums.map((enm) => {
												const isEnumSelected =
													selectedItem.type === "enum" &&
													selectedItem.data.name === enm.name
												return (
													<button
														key={`enum-${enm.name}`}
														onClick={() =>
															setSelectedItem({
																type: "enum",
																schemaName: schema.name,
																data: enm,
															})
														}
														className={cn(
															"flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50 text-muted-foreground",
															isEnumSelected &&
																"bg-muted text-foreground font-medium",
														)}
													>
														<HugeiconsIcon
															icon={GridIcon}
															size={12}
															className="shrink-0"
														/>
														<span className="truncate">{enm.name}</span>
													</button>
												)
											})}
											{schema.functions.map((fn) => {
												const isFnSelected =
													selectedItem.type === "function" &&
													selectedItem.data.name === fn.name
												return (
													<button
														key={`fn-${fn.name}`}
														onClick={() =>
															setSelectedItem({
																type: "function",
																schemaName: schema.name,
																data: fn,
															})
														}
														className={cn(
															"flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50 text-muted-foreground",
															isFnSelected &&
																"bg-muted text-foreground font-medium",
														)}
													>
														<HugeiconsIcon
															icon={FunctionIcon}
															size={12}
															className="shrink-0"
														/>
														<span className="truncate">{fn.name}</span>
													</button>
												)
											})}
										</div>
									)}
								</div>
							)
						})}
					</div>
				</ScrollArea>
			</div>

			{/* ── Main Detail Area ── */}
			<div className="flex flex-1 flex-col overflow-auto bg-background/50">
				{selectedItem.type === "schema" && (
					<SchemaDetail schema={selectedItem.data} />
				)}
				{selectedItem.type === "table" && (
					<TableDetail table={selectedItem.data} />
				)}
				{selectedItem.type === "view" && (
					<ViewDetail view={selectedItem.data} />
				)}
				{selectedItem.type === "enum" && <EnumDetail enm={selectedItem.data} />}
				{selectedItem.type === "function" && (
					<FunctionDetail fn={selectedItem.data} />
				)}
			</div>
		</div>
	)
}

// ─── Subcomponents for Details ───

function SchemaDetail({ schema }: { schema: PGSchema }) {
	return (
		<div className="p-6">
			<div className="mb-6 space-y-1">
				<h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
					<HugeiconsIcon
						icon={Folder01Icon}
						size={24}
						className="text-muted-foreground"
					/>
					Schema: {schema.name}
				</h1>
				<p className="text-sm text-muted-foreground">
					Contains {schema.tables.length} tables, {schema.views.length} views,
					and {schema.functions.length} functions.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<MetricCard
					title="Tables"
					count={schema.tables.length}
					icon={TableIcon}
				/>
				<MetricCard
					title="Views"
					count={schema.views.length}
					icon={ListViewIcon}
				/>
				<MetricCard title="Enums" count={schema.enums.length} icon={GridIcon} />
				<MetricCard
					title="Functions"
					count={schema.functions.length}
					icon={FunctionIcon}
				/>
			</div>
		</div>
	)
}

function MetricCard({
	title,
	count,
	icon: Icon,
}: {
	title: string
	count: number
	// biome-ignore lint/suspicious/noExplicitAny: wip
	icon: any
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<HugeiconsIcon
					icon={Icon}
					size={16}
					className="text-muted-foreground"
				/>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{count}</div>
			</CardContent>
		</Card>
	)
}

function TableDetail({ table }: { table: PGTable }) {
	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>{table.schema_name}</span>
					<span>/</span>
				</div>
				<h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
					<HugeiconsIcon icon={TableIcon} size={24} className="text-primary" />
					{table.name}
				</h1>
				{table.comment && (
					<p className="mt-2 text-sm text-muted-foreground">{table.comment}</p>
				)}
			</div>

			{/* Columns Table */}
			<Card>
				<CardHeader className="pb-3 border-b">
					<CardTitle className="text-base font-medium">Columns</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b bg-muted/30">
									<th className="px-4 py-3 text-left font-medium text-muted-foreground">
										Name
									</th>
									<th className="px-4 py-3 text-left font-medium text-muted-foreground">
										Type
									</th>
									<th className="px-4 py-3 text-left font-medium text-muted-foreground">
										Nullable
									</th>
									<th className="px-4 py-3 text-left font-medium text-muted-foreground">
										Default
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/50">
								{table.columns.map((col) => {
									let typeStr = col.data_type.type
									if ("data" in col.data_type && col.data_type.data) {
										// biome-ignore lint/suspicious/noExplicitAny: wip
										const d: any = col.data_type.data
										if (d.length) typeStr += `(${d.length})`
										if (d.name) typeStr = d.name
									}
									const pKeyCol = table.indexes
										.find((i) => i.is_primary_key)
										?.columns.includes(col.name)
									const isFKey = table.constraints.some(
										(c) =>
											c.constraint_type.type === "ForeignKey" &&
											c.columns.includes(col.name),
									)

									return (
										<tr
											key={col.name}
											className="hover:bg-muted/10 transition-colors"
										>
											<td className="px-4 py-3 font-mono text-xs font-semibold flex items-center gap-2">
												{col.name}
												{pKeyCol && (
													<span
														title="Primary Key"
														className="rounded-full bg-yellow-500/10 px-1.5 py-0.5 text-[9px] font-bold text-yellow-600 dark:text-yellow-500"
													>
														PK
													</span>
												)}
												{isFKey && (
													<span
														title="Foreign Key"
														className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-500"
													>
														FK
													</span>
												)}
											</td>
											<td className="px-4 py-3 font-mono text-xs text-muted-foreground">
												{typeStr}
											</td>
											<td className="px-4 py-3">
												{col.is_nullable ? (
													<span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
														Yes
													</span>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</td>
											<td className="px-4 py-3 max-w-[200px] truncate font-mono text-xs text-muted-foreground">
												{col.default_value ?? "-"}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Indexes and Constraints Row */}
			{((table.indexes && table.indexes.length > 0) ||
				(table.constraints && table.constraints.length > 0)) && (
				<div className="grid gap-6 lg:grid-cols-2">
					{table.indexes && table.indexes.length > 0 && (
						<Card>
							<CardHeader className="pb-3 border-b">
								<CardTitle className="text-base font-medium">Indexes</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<tbody className="divide-y divide-border/50">
											{table.indexes.map((idx) => (
												<tr
													key={idx.name}
													className="hover:bg-muted/10 transition-colors"
												>
													<td className="px-4 py-3">
														<div className="font-mono text-xs font-semibold">
															{idx.name}
														</div>
														<div className="mt-1 flex gap-1">
															<span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
																USING {idx.index_type}
															</span>
															{idx.is_unique && (
																<span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
																	UNIQUE
																</span>
															)}
														</div>
													</td>
													<td className="px-4 py-3 font-mono text-xs text-muted-foreground text-right">
														{idx.columns.join(", ")}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}

					{table.constraints && table.constraints.length > 0 && (
						<Card>
							<CardHeader className="pb-3 border-b">
								<CardTitle className="text-base font-medium">
									Constraints
								</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<tbody className="divide-y divide-border/50">
											{table.constraints.map((c) => {
												let detailStr = c.columns.join(", ")
												if (c.constraint_type.type === "Check") {
													detailStr = c.constraint_type.data
												} else if (c.constraint_type.type === "ForeignKey") {
													detailStr = `REFERENCES ${c.constraint_type.data.foreign_table}(${c.constraint_type.data.foreign_columns.join(", ")})`
												}

												return (
													<tr
														key={c.name}
														className="hover:bg-muted/10 transition-colors"
													>
														<td className="px-4 py-3">
															<div className="font-mono text-xs font-semibold">
																{c.name}
															</div>
															<div className="mt-1 flex gap-1">
																<span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
																	{c.constraint_type.type}
																</span>
															</div>
														</td>
														<td className="px-4 py-3 font-mono text-xs text-muted-foreground text-right max-w-[200px] truncate">
															{detailStr}
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	)
}

// biome-ignore lint/suspicious/noExplicitAny: wip
function ViewDetail({ view }: { view: any }) {
	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>{view.schema_name}</span>
					<span>/</span>
				</div>
				<h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
					<HugeiconsIcon
						icon={ListViewIcon}
						size={24}
						className="text-chart-2"
					/>
					{view.name}
				</h1>
				{view.is_updatable && (
					<span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase">
						Updatable
					</span>
				)}
			</div>

			<Card>
				<CardHeader className="pb-3 border-b">
					<CardTitle className="text-base font-medium">Definition</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<pre className="p-4 text-xs font-mono overflow-auto text-muted-foreground leading-relaxed">
						{view.definition}
					</pre>
				</CardContent>
			</Card>
		</div>
	)
}

// biome-ignore lint/suspicious/noExplicitAny: wip
function EnumDetail({ enm }: { enm: any }) {
	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>{enm.schema_name}</span>
					<span>/</span>
				</div>
				<h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
					<HugeiconsIcon icon={GridIcon} size={24} className="text-chart-3" />
					{enm.name}
				</h1>
			</div>

			<Card className="max-w-md">
				<CardHeader className="pb-3 border-b">
					<CardTitle className="text-base font-medium">Variants</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-border/50">
						{enm.variants.map((v: string, i: number) => (
							<div key={v} className="px-4 py-3 flex items-center gap-4">
								<span className="text-xs text-muted-foreground tabular-nums w-4">
									{i + 1}.
								</span>
								<span className="font-mono text-sm">{v}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

// biome-ignore lint/suspicious/noExplicitAny: wip
function FunctionDetail({ fn }: { fn: any }) {
	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>{fn.schema_name}</span>
					<span>/</span>
				</div>
				<h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
					<HugeiconsIcon
						icon={FunctionIcon}
						size={24}
						className="text-chart-4"
					/>
					{fn.name}
				</h1>
				<div className="mt-2 flex gap-2">
					<span className="rounded bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
						{fn.language}
					</span>
					{fn.is_procedure && (
						<span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase">
							Procedure
						</span>
					)}
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader className="pb-3 border-b">
						<CardTitle className="text-base font-medium">Arguments</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-border/50">
							{fn.argument_types.length > 0 ? (
								fn.argument_types.map((arg: string) => (
									<div key={arg} className="px-4 py-2 font-mono text-xs">
										{arg}
									</div>
								))
							) : (
								<div className="px-4 py-3 text-xs text-muted-foreground italic">
									No arguments
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3 border-b">
						<CardTitle className="text-base font-medium">Return Type</CardTitle>
					</CardHeader>
					<CardContent className="p-4">
						<div className="font-mono text-sm">{fn.return_type}</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3 border-b">
					<CardTitle className="text-base font-medium">Definition</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<pre className="p-4 text-xs font-mono overflow-auto text-muted-foreground leading-relaxed bg-muted/10">
						{fn.definition}
					</pre>
				</CardContent>
			</Card>
		</div>
	)
}
