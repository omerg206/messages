export enum MessageStatus {
    Pending = 'pending',
    Failed = 'failed',
    Sent = 'sent',
}

export type MessageRequiredByUser = Pick<Message, 'body' | 'sender'>


export interface Message {
    sender: string;
    body: string;
    status: MessageStatus,
    creationDate: string;
    sentDate?: undefined | string;
}


export enum MessageSortDirection {
    asc = 1,
    desc = -1
}

export interface GetMessageParams {
    pageSize: number;
    pageNumber: number;
    sortColumn: keyof Message;
    direction: MessageSortDirection;
    filter?: string | null
}

export interface GetPagedMessageResponse {
    messages: Message[],
    totalCount: number
}