export interface WebComponent {
    _id: string;
    filePath: string;
    customTagName: string;
}

export interface Json {
    _id: string;
    schemaFilePath: string;
    uiSchemaFilePath: string;
}

export interface UiDropdownOptions {
    id: string;
    type: string;
    name: string;
}
