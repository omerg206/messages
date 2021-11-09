import { Message, MessageStatus } from './../../../shared/messages.model';
import { Schema, model } from 'mongoose';


const schema = new Schema<Message>({
    sender: { type: String, required: true, index: true },
    body: { type: String, default: "" },
    status: { type: String, default: MessageStatus.Pending, required: true, enum: Object.values(MessageStatus) },
    sentDate: { types: String },
    creationDate: { type: String, required: true, default: new Date().toString() }
});



schema.index({ "$**": "text", _id: 1 })
schema.index({ status: 1, _id: 1 })
schema.index({ status: -1, _id: 1 })
schema.index({ createdAt: 1, _id: 1 })

export const MessageModel = model<Message>('message', schema);


