type Column = {
    name: string;
    constraints: Constraint[];
    nullable: boolean;
    default: string;
};

type Constraint = {};
type Relation = {
    tableName: string;
    mappings: {
        fromColumnName: string;
        toColumnName: string;
    };
};
type Table = {
    Name: string;
    Columns: Column[];
    relations: Relation[];
};
