import { faker } from "@faker-js/faker"
import {
	ArrowLeft01Icon,
	ArrowRight01Icon,
	Database01Icon,
	Folder01Icon,
	Search01Icon,
	TableIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import mockSchemaRaw from "@/../testdata/dvdrental.json"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PGDatabase, PGSchema, PGTable } from "@/types/database"

export const Route = createFileRoute("/app/data/")({
	component: DataViewer,
})

const mockDatabase = mockSchemaRaw as unknown as PGDatabase
const ROWS_PER_PAGE = 50

// biome-ignore lint/suspicious/noExplicitAny: generic row
type DataRow = Record<string, any>

// Generate synthetic data based on column types
function generateMockRow(table: PGTable): DataRow {
	const row: DataRow = {}
	for (const col of table.columns) {
		let typeStr = col.data_type.type.toLowerCase()
		if ("data" in col.data_type && col.data_type.data) {
			// biome-ignore lint/suspicious/noExplicitAny: wip
			const d: any = col.data_type.data
			if (d.name) typeStr = d.name.toLowerCase()
		}

		if (col.name.includes("id")) {
			row[col.name] = faker.number.int({ min: 1, max: 10000 })
		} else if (typeStr.includes("int")) {
			row[col.name] = faker.number.int({ min: 0, max: 1000 })
		} else if (typeStr.includes("bool")) {
			row[col.name] = faker.datatype.boolean()
		} else if (typeStr.includes("timestamp") || typeStr.includes("date")) {
			row[col.name] = faker.date.recent().toISOString()
		} else if (col.name.includes("email")) {
			row[col.name] = faker.internet.email()
		} else if (col.name.includes("name")) {
			row[col.name] = faker.person.fullName()
		} else if (typeStr.includes("numeric") || typeStr.includes("decimal")) {
			row[col.name] = faker.finance.amount({ min: 0, max: 1000, dec: 2 })
		} else {
			row[col.name] = faker.lorem.words({ min: 1, max: 3 })
		}
	}
	return row
}

function DataViewer() {
	const defaultSchema = mockDatabase.schemas[0]

	const [selectedTable, setSelectedTable] = useState<{
		schema: PGSchema
		table: PGTable
	} | null>(null)

	const [expandedSchemas, setExpandedSchemas] = useState<
		Record<string, boolean>
	>({
		[defaultSchema.name]: true,
	})
	const [searchQuery, setSearchQuery] = useState("")

	const toggleSchema = (schemaName: string) => {
		setExpandedSchemas((prev) => ({
			...prev,
			[schemaName]: !prev[schemaName],
		}))
	}

	// Filter schemas/tables based on search query
	const filteredSchemas = useMemo(() => {
		if (!searchQuery.trim()) return mockDatabase.schemas

		const lowerQuery = searchQuery.toLowerCase()
		return mockDatabase.schemas
			.map((schema) => {
				if (schema.name.toLowerCase().includes(lowerQuery)) {
					return schema // Schema name matches, include all its tables
				}
				// Otherwise filter its tables
				const matchingTables = schema.tables.filter((t) =>
					t.name.toLowerCase().includes(lowerQuery),
				)
				return { ...schema, tables: matchingTables }
			})
			.filter(
				(schema) =>
					schema.tables.length > 0 ||
					schema.name.toLowerCase().includes(lowerQuery),
			)
	}, [searchQuery])

	return (
		<div className="flex h-full w-full overflow-hidden">
			{/* ── Left Sidebar (Table Explorer) ── */}
			<div className="flex w-64 flex-col border-r bg-muted/20">
				<div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
					<h2 className="flex items-center gap-2 font-display text-sm font-semibold">
						<HugeiconsIcon icon={Database01Icon} size={16} />
						{mockDatabase.name}
					</h2>
				</div>

				<div className="border-b p-2">
					<div className="relative">
						<HugeiconsIcon
							icon={Search01Icon}
							size={13}
							className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>
						<input
							type="text"
							placeholder="Search tables..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-8 w-full rounded-md border border-border bg-muted/40 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/30 transition-all"
						/>
					</div>
				</div>

				<ScrollArea className="flex-1">
					<div className="flex flex-col gap-1 p-2">
						{filteredSchemas.map((schema) => {
							const isExpanded =
								expandedSchemas[schema.name] || searchQuery.trim() !== ""

							return (
								<div key={schema.name} className="flex flex-col">
									{/* Schema Toggle */}
									<button
										onClick={() => toggleSchema(schema.name)}
										className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
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

									{/* Tables List */}
									{isExpanded && (
										<div className="ml-4 mt-1 flex flex-col gap-0.5 border-l pl-2">
											{schema.tables.map((table) => {
												const isSelected =
													selectedTable?.table.name === table.name &&
													selectedTable?.schema.name === schema.name
												return (
													<button
														key={table.name}
														onClick={() => setSelectedTable({ schema, table })}
														className={cn(
															"flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50 text-muted-foreground",
															isSelected &&
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
											{schema.tables.length === 0 && (
												<div className="px-2 py-1 text-xs text-muted-foreground italic">
													No tables
												</div>
											)}
										</div>
									)}
								</div>
							)
						})}
						{filteredSchemas.length === 0 && (
							<div className="p-4 text-center text-xs text-muted-foreground">
								No tables found.
							</div>
						)}
					</div>
				</ScrollArea>
			</div>

			{/* ── Main Detail Area ── */}
			<div className="flex flex-1 flex-col overflow-hidden bg-background">
				{selectedTable ? (
					<DataGrid schema={selectedTable.schema} table={selectedTable.table} />
				) : (
					<div className="flex h-full items-center justify-center text-muted-foreground">
						<div className="flex flex-col items-center gap-4 text-sm">
							<HugeiconsIcon
								icon={TableIcon}
								size={48}
								className="text-muted/50"
							/>
							<p>Select a table to view its data.</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

function DataGrid({ schema, table }: { schema: PGSchema; table: PGTable }) {
	const [currentPage, setCurrentPage] = useState(1)

	// Generate 150 rows of mock data once per table selection
	const allRows = useMemo(() => {
		const rows: DataRow[] = []
		for (let i = 0; i < 150; i++) {
			rows.push(generateMockRow(table))
		}
		return rows
	}, [table])

	const totalPages = Math.ceil(allRows.length / ROWS_PER_PAGE)
	const startIndex = (currentPage - 1) * ROWS_PER_PAGE
	const currentRows = allRows.slice(startIndex, startIndex + ROWS_PER_PAGE)

	// Identify primary and foreign keys for quick lookup
	const pkColumns = new Set(
		table.indexes.find((i) => i.is_primary_key)?.columns || [],
	)

	const fkColumns = new Set(
		table.constraints
			.filter((c) => c.constraint_type.type === "ForeignKey")
			.flatMap((c) => c.columns),
	)

	const uniqueColumns = new Set(
		table.indexes
			.filter((i) => i.is_unique && !i.is_primary_key)
			.flatMap((i) => i.columns),
	)

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
				<div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>{schema.name}</span>
						<span>/</span>
					</div>
					<h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
						<HugeiconsIcon
							icon={TableIcon}
							size={24}
							className="text-primary"
						/>
						{table.name}
					</h1>
				</div>
				<div className="text-sm text-muted-foreground">
					Total Rows:{" "}
					<span className="font-semibold text-foreground">
						{allRows.length}
					</span>
				</div>
			</div>

			{/* Table Content */}
			<div className="flex-1 overflow-hidden relative">
				<ScrollArea className="h-full w-full">
					<table className="w-full text-sm border-collapse">
						<thead className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
							<tr>
								<th className="w-12 border-b border-r border-border p-2 bg-muted/20 sticky left-0 z-20"></th>
								{table.columns.map((col) => {
									let typeStr = col.data_type.type
									if ("data" in col.data_type && col.data_type.data) {
										// biome-ignore lint/suspicious/noExplicitAny: wip
										const d: any = col.data_type.data
										if (d.length) typeStr += `(${d.length})`
										if (d.name) typeStr = d.name
									}

									return (
										<th
											key={col.name}
											className="border-b border-r border-border px-4 py-2 text-left font-medium whitespace-nowrap min-w-[150px] max-w-[300px]"
										>
											<div className="flex items-center gap-2">
												<span className="font-semibold">{col.name}</span>
												<div className="flex gap-1 ml-auto">
													{pkColumns.has(col.name) && (
														<span
															title="Primary Key"
															className="rounded bg-yellow-500/10 px-1 py-0.5 text-[9px] font-bold text-yellow-600 dark:text-yellow-500"
														>
															PK
														</span>
													)}
													{fkColumns.has(col.name) && (
														<span
															title="Foreign Key"
															className="rounded bg-blue-500/10 px-1 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-500"
														>
															FK
														</span>
													)}
													{uniqueColumns.has(col.name) && (
														<span
															title="Unique"
															className="rounded bg-primary/10 px-1 py-0.5 text-[9px] font-bold text-primary"
														>
															UQ
														</span>
													)}
												</div>
											</div>
											<div className="font-mono text-[10px] text-muted-foreground mt-0.5">
												{typeStr}
												{!col.is_nullable && (
													<span className="opacity-70 ml-1">NOT NULL</span>
												)}
											</div>
										</th>
									)
								})}
							</tr>
						</thead>
						<tbody className="divide-y divide-border font-mono text-xs">
							{currentRows.map((row, i) => (
								<tr
									// biome-ignore lint/suspicious/noArrayIndexKey: no guaranteed id field
									key={i}
									className="hover:bg-muted/30 transition-colors group"
								>
									<td className="border-r border-border p-2 text-center text-muted-foreground/50 text-[10px] bg-muted/10 sticky left-0 group-hover:bg-muted/50 group-hover:text-muted-foreground transition-colors z-10">
										{startIndex + i + 1}
									</td>
									{table.columns.map((col) => {
										const val = row[col.name]
										return (
											<td
												key={col.name}
												className="border-r border-border px-4 py-2 truncate max-w-[300px]"
												title={String(val)}
											>
												{val === null || val === undefined ? (
													<span className="text-muted-foreground/50 italic">
														null
													</span>
												) : typeof val === "boolean" ? (
													<span
														className={
															val ? "text-green-600" : "text-destructive"
														}
													>
														{String(val)}
													</span>
												) : (
													String(val)
												)}
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
					</table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>

			{/* Pagination Footer */}
			<div className="flex shrink-0 items-center justify-between border-t px-6 py-3 bg-muted/10">
				<div className="text-xs text-muted-foreground">
					Showing {startIndex + 1}-
					{Math.min(startIndex + ROWS_PER_PAGE, allRows.length)} of{" "}
					{allRows.length} rows
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-8 gap-1"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
					>
						<HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
						Prev
					</Button>
					<span className="text-xs font-medium tabular-nums px-2">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="h-8 gap-1"
						disabled={currentPage === totalPages}
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
					>
						Next
						<HugeiconsIcon icon={ArrowRight01Icon} size={14} />
					</Button>
				</div>
			</div>
		</div>
	)
}
