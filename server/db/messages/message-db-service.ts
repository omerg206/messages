import { GetMessageParams, GetPagedMessageResponse, Message, MessageRequiredByUser, MessageStatus, MessageSortDirection } from "../../../shared/messages.model";
import { configService } from "../../services/config-service";
import { MessageModel } from "./message-schema";



export class MessageDbService {

    constructor() { }


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

    private createPagingMessageQuery({ pageNumber, pageSize, direction, sortColumn, searchAfter, searchBefore, filter = null }: GetMessageParams): any[] {
        const isPartialSearch: boolean = true;

        const query: any = [{
            $facet: {
                docs: [
                    { $sort: { [sortColumn]: MessageSortDirection[direction], _id: 1 } },
                    { $limit: pageSize },

                ],
                totalCount: [
                    { $count: 'totalCount' }
                ]
            }
        }];

        if (pageNumber !== 0) {
            if (searchAfter) {
                console.log('after')
                query.unshift({ $match: { [sortColumn]: { $gt: searchAfter } } })
            } else if (searchBefore) {
                console.log('before', sortColumn, searchBefore)
                query.unshift({ $match: { [sortColumn]: { $lt: searchBefore } } })
            }
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