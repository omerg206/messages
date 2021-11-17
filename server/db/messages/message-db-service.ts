import { GetMessageParams, GetPagedMessageResponse, Message, MessageRequiredByUser, MessageStatus, MessageSortDirection } from "../../../shared/messages.model";
import { configService } from "../../services/config-service";
import { MessageModel, MessageDefinitions } from './message-schema';
import { ObjectId } from "mongodb";
import { cloneDeep, forEach } from 'lodash'
import { SchemaDefinition, SchemaDefinitionProperty, SchemaDefinitionType, SchemaType } from "mongoose";

export class MessageDbService {

    constructor() {
    }



    getMessagePropDefinition() {
        const definitions: SchemaDefinition<SchemaDefinitionType<Message>> = cloneDeep(MessageDefinitions);
        forEach(definitions, (ele: any, key: string) => {
            delete ele['default'];
            ele.type = ele.enum ? 'Enum' : ele.type.schemaName;
        });

        return definitions;
    }




    async getAllMessages(): Promise<Array<Message>> {
        try {
            return await MessageModel.find();
        }
        catch (error) {
            console.error('error getting all messages', error)
            throw (error)
        }
    }


    async getPagingMessages(params: GetMessageParams): Promise<GetPagedMessageResponse> {
        try {
            const query = this.createPagingMessageQuery(params);

            const [{ docs, totalCount }] = await MessageModel.aggregate(query)
            const totalDocLength: number = totalCount.length > 0 ? totalCount[0]['totalCount'] : 0;

            return { messages: docs, totalCount: totalDocLength }


        }
        catch (error) {
            console.error('error paging getting  messages', error)
            throw (error)
        }
    }



    async saveNewMessage(messageData: MessageRequiredByUser): Promise<void> {
        try {
            const docAfterSave = await new MessageModel({
                ...messageData,
                status: MessageStatus.Pending
            }).save();

            this.mockSendMessageTo3rdParty(docAfterSave.id)

            return docAfterSave.id;
        }
        catch (error) {
            console.error('error saving message', error)
            throw (error)
        }
    }


    async getMessageStatus(messageId: string): Promise<any> {
        try {
            const { status } = await MessageModel.findOne({ _id: messageId }, 'status') as Partial<Message>
            return { status }
        } catch (error) {
            console.error(`error getting message by id ${messageId}`, error)
            throw (error)
        }
    }

    async updateASingleMessageProp(id: string, newValue: Partial<Message>) {
        try {
            const res = await MessageModel.findOneAndUpdate(
                { _id: id }, { $set: { ...newValue } }, { returnDocument: 'after' }
            );

            if (!res) {
                throw new Error(`could not update doc ${id} with values ${JSON.stringify(newValue)}`)
            }


            return (res as any)._doc;
        }
        catch (error) {
            console.error(`error updating message prop ${newValue}`, error)
            throw (error)
        }
    }

    async deleteMessage(id: string) {
        try {
            const {deletedCount} = await MessageModel.deleteOne(
                { _id: id }
            );

            if (deletedCount !== 1) {
                throw new Error(`could not delete doc ${id}}`)
            }

            return;
        }
        catch (error) {
            console.error(`error deleting message prop ${id}`, error)
            throw (error)
        }
    }

    private createPagingMessageQuery({ pageNumber, pageSize, direction, sortColumn, searchBeforeOrAfterId, searchAfter, searchBefore, filter = null }: GetMessageParams): any[] {
        const isPartialSearch: boolean = true;
        const sortDocsQuery = { $sort: { [sortColumn]: MessageSortDirection[direction], _id: MessageSortDirection[direction] } };
        const facetQuey = {
            $facet: {
                docs: [
                    { ...sortDocsQuery },
                    { $limit: pageSize },
                    { $sort: { [sortColumn]: MessageSortDirection[direction], _id: MessageSortDirection[direction] } }
                ],
                totalCount: [
                    { $count: 'totalCount' }
                ]
            }
        };

        const query: any = [facetQuey];

        if (pageNumber !== 0) {
            const searchBeforeOrAfter = searchAfter ?? searchBefore
            const GtOrLt = ((MessageSortDirection[direction] as any) === MessageSortDirection.asc && searchAfter) ||
                ((MessageSortDirection[direction] as any) === MessageSortDirection.desc && searchBefore) ? 'gt' : 'lt';

            if (searchBefore) {
                const sortAfterDirection = MessageSortDirection[direction] as any === MessageSortDirection.asc ? MessageSortDirection.desc : MessageSortDirection.asc;
                (sortDocsQuery.$sort as any)[sortColumn] = sortAfterDirection;
            }

            query.unshift({ $match: { [sortColumn]: { [`$${GtOrLt}e`]: searchBeforeOrAfter } } });
            (facetQuey['$facet']['docs'] as any[]).unshift({
                $match: {
                    $or: [
                        { [sortColumn]: { [`$${GtOrLt}`]: searchBeforeOrAfter } },
                        {
                            $and: [
                                { [sortColumn]: { $eq: searchBeforeOrAfter } },
                                { _id: { [`$${GtOrLt}`]: new ObjectId(searchBeforeOrAfterId) } },
                            ]
                        }
                    ]
                }
            })
        }

        if (filter) {
            if (isPartialSearch) {
                const partialTextQuery = this.createPartialTextSubQuery(filter);
                query.unshift(partialTextQuery);

            } else {
                query.unshift({ $match: { $text: { $search: `"${filter}"` } } });
            }
        }

        return query;
    }

    private createPartialTextSubQuery(filter: string) {
        const textFields: string[] = ['sender', 'body', 'status', 'creationDate'];
        const partialTextQuery = { $match: { $or: [] } };

        textFields.forEach((messageKey: string) => {
            const regexQuery = { [messageKey]: { $regex: filter, $options: "i" } };
            (partialTextQuery['$match']['$or'] as any[]).push(regexQuery);
        });

        return partialTextQuery;
    }

    private mockSendMessageTo3rdParty(messageId: string) {
        setTimeout(async () => {
            try {
                return MessageModel.findOneAndUpdate({ _id: messageId }, { $set: { status: MessageStatus.Sent } });
            } catch (error) {
                console.error('error saving message', error)
            }
        }, this.getSendMessageTimeout())

    }

    private getSendMessageTimeout(): number {
        const minTime = configService.config.minTimeoutSendMessageRange;
        const maxTime = configService.config.maxTimeoutSendMessageRange;

        return Math.random() * (maxTime - minTime) + minTime;
    }

}


export const messageDbService = new MessageDbService();