export interface IMatGridAction {
    label: string;
    icon: string;
    enable: boolean;
    execute: Function;
}

export interface IMatGridHeaders {
    [key: string]: string;
}

export interface IMatGridConfig {
    target: string;
    title: string;
    headers: IMatGridHeaders;
    columns: string[];
    data: any[];
}
