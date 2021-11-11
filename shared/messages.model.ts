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
    _id: string;
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
    filter?: string | null,
    searchAfter?: string | number | Date;
    searchBefore?: string | number | Date;
    searchBeforeOrAfterId?: string;
}

export interface GetPagedMessageResponse {
    messages: Message[],
    totalCount: number
}