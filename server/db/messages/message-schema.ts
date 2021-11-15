import { Message, MessageStatus } from './../../../shared/messages.model';
import { Schema, model, SchemaDefinition, SchemaDefinitionType, Number } from 'mongoose';



export const MessageDefinitions: SchemaDefinition<SchemaDefinitionType<Message>> =
{
    sender: { type: Schema.Types.String, required: true },
    body: { type: Schema.Types.String, default: "" },
    status: { type: Schema.Types.String, default: MessageStatus.Pending, required: true, enum: Object.values(MessageStatus) },
    sentDate: { type: Schema.Types.String },
    creationDate: { type: Schema.Types.Date, required: true, default: new Date()}
}



const schema = new Schema<Message>(MessageDefinitions);




schema.index({ "$**": "text", _id: 1 })
schema.index({ "$**": "text", _id: -1 })
// schema.index({ status: 1, _id: 1 })
schema.index({ "$**": 1, _id: -1 })
schema.index({ "$**": 1, _id: 1 })
// schema.index({ createdAt: 1, _id: 1 })

export const MessageModel = model<Message>('message', schema);


