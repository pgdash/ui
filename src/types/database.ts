export interface PGDatabase {
	name: string
	schemas: PGSchema[]
}

export interface PGSchema {
	oid: number
	name: string
	tables: PGTable[]
	views: PGView[]
	enums: PGEnum[]
	functions: PGFunction[]
	sequences: PGSequence[]
}

export interface PGTable {
	oid: number
	name: string
	schema_name: string
	columns: PGColumn[]
	indexes: PGIndex[]
	constraints: PGConstraint[]
	triggers: PGTrigger[]
	comment: string | null
}

export interface PGView {
	oid: number
	name: string
	schema_name: string
	definition: string
	is_updatable: boolean
}

export interface PGEnum {
	oid: number
	name: string
	schema_name: string
	variants: string[]
}

export interface PGFunction {
	oid: number
	name: string
	schema_name: string
	argument_types: string[]
	return_type: string
	definition: string
	language: string
	is_procedure: boolean
}

export interface PGSequence {
	oid: number
	name: string
	schema_name: string
	start_value: number
	increment_by: number
	min_value: number
	max_value: number
	cycle: boolean
}

// ─── Columns & Types ──────────────────────────────────────────────────────────

export interface PGColumn {
	name: string
	data_type: PGDataType
	is_nullable: boolean
	default_value: string | null
	comment: string | null
}

export type PGDataType =
	| { type: "Integer" | "SmallInt" | "BigInt" | "Boolean" | "Text" }
	| { type: "Varchar" | "Char"; data: { length: number } }
	| { type: "Numeric"; data: { precision?: number; scale?: number } }
	| { type: "Timestamp" | "Time"; data: { with_time_zone: boolean } }
	| { type: "Custom"; data: { name: string } }

// ─── Indexes & Constraints ────────────────────────────────────────────────────

export interface PGIndex {
	name: string
	is_unique: boolean
	is_primary_key: boolean
	columns: string[]
	index_type: string
	partial_condition: string | null
	definition: string
}

export interface PGConstraint {
	name: string
	columns: string[]
	constraint_type: PGConstraintType
}

export type PGConstraintType =
	| { type: "PrimaryKey" | "Unique" }
	| { type: "Check"; data: string } // The check condition
	| {
			type: "ForeignKey"
			data: {
				foreign_schema: string
				foreign_table: string
				foreign_columns: string[]
				on_delete: string
				on_update: string
			}
	  }

// ─── Triggers ────────────────────────────────────────────────────────────────

export interface PGTrigger {
	name: string
	event_manipulation: string
	action_statement: string
	action_timing: string
	action_condition: string | null
}
