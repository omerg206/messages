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
    creationDate: Date;
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

export interface GetMessagePropDefinitionResponse {
    messageDefinition: { [key: string]: Object }
}

export type SingleMessagePropDefinition = { required?: boolean, enum?: string[], type: string };

export interface DeleteMessageResponse 
 {deletedId: string};