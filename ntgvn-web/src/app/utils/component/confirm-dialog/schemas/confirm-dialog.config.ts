export interface IConfirmDialogAction {
    text: string;
    color?: string;
    backgroundColor?: string;
    action: any;
}

export interface IConfirmDialogData {
    title: string;
    content: any;
    actions: [IConfirmDialogAction]
}
