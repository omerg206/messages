import { MessageRequiredByUser, GetMessageParams, Message } from '../../shared/messages.model';
import { MessageDbService } from "../db/messages/message-db-service";




export async function getAllMessages(messagesService: MessageDbService): Promise<ReturnType<MessageDbService["getAllMessages"]>> {
    return messagesService.getAllMessages();
}


export async function saveNewMessage(messagesService: MessageDbService, messageData: MessageRequiredByUser) {
    return messagesService.saveNewMessage(messageData);
}

export async function getMessageStatus(messagesService: MessageDbService, messageId: string) {
    return messagesService.getMessageStatus(messageId);
}

export async function getPagingMessages(messagesService: MessageDbService, pagingParams: GetMessageParams,) {
    return messagesService.getPagingMessages(pagingParams);
}

export async function updateASingleMessageProp(messagesService: MessageDbService, id: string, newMessagePropValue: Partial<Message>) {
    return messagesService.updateASingleMessageProp(id, newMessagePropValue);
}

