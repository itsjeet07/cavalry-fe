export interface tableRequest{
    _id?: string;
    tableName?: string;
    columns?: columnRequest[],
    isActive?: boolean
}

export interface columnRequest{
    _id?: string;
    tableId?: string;
    label?: string; 
    type?: string;
    isRequired?: boolean;
    isActive?: boolean;
    displayPriority?: number;
    isSearchable?: boolean;
    name?: string;
    section?: string;
    isSensitive?: boolean;
    options?: any;
}