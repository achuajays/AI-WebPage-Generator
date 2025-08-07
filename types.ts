export enum ToastType {
    Success = 'SUCCESS',
    Error = 'ERROR',
}

export interface ToastMessage {
    id: number;
    type: ToastType;
    message: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string | number;
}
