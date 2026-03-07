type Column = {
	name: string
	constraints: Constraint[]
	nullable: boolean
	default: string
}

type Constraint = {
	name: string
}
type Relation = {
	tableName: string
	mappings: {
		fromColumnName: string
		toColumnName: string
	}
}
export type Table = {
	Name: string
	Columns: Column[]
	relations: Relation[]
}
