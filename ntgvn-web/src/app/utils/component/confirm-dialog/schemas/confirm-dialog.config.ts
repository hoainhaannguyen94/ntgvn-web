export interface IConfirmDialogAction {
    key?: string;
    text: string;
    color?: string;
    backgroundColor?: string;
    execute: Function;
}

export interface IConfirmDialogData {
    title: string;
    content: any;
    actions: [IConfirmDialogAction]
}
