export interface WebComponent {
    _id: string;
    filePath: string;
    customTagName: string;
    formName: string;
}

export interface Json {
    _id: string;
    schemaFilePath: string;
    uiSchemaFilePath: string;
    formName: string;
}

export interface UiDropdownOptions {
    id: string;
    type: string;
    name: string;
}

export interface ExampleForm {
    id: string;
    email: string;
    password: string;
    forwarders: string[];
    serverIp: string;
}
