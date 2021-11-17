import { GetPagedMessageResponse } from './../../shared/messages.model';
import { Response, Request, NextFunction } from 'express'
import { getAllMessages, getMessageStatus, getPagingMessages, saveNewMessage, getMessagePropDefinition, updateASingleMessageProp, deleteMessage } from '../controllers/messages.controller';
import { messageDbService } from '../db/messages/message-db-service';
import { body, validationResult, query } from 'express-validator';
import { AppRoutes } from '../../shared/routes.model';


const express = require('express')
    , router = express.Router()




// router.use('/comments', require('./comments'))
// router.use('/users', require('./users'))

router.get(AppRoutes.getAll, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const messages = await getAllMessages(messageDbService)
        return res.status(200).json(messages);
    } catch (error) {
        return next(error)
    }

})

router.get(AppRoutes.getPagingMessages,
    query('directionParams').exists(),


    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const queryRes: GetPagedMessageResponse = await getPagingMessages(messageDbService, JSON.parse(req.query['directionParams'] as string));
            return res.status(200).json(queryRes);
        } catch (error) {
            return next(error)
        }

    })




router.get(AppRoutes.getMessageStatus, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const messages = await getMessageStatus(messageDbService, req.body.messageId)
        return res.status(200).json(messages);
    } catch (error) {
        return next(error)
    }

})

router.post(AppRoutes.saveMessage, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const messageId = await saveNewMessage(messageDbService, req.body)
        return res.status(200).json(messageId);
    } catch (error) {
        return next(error)
    }

})

router.patch(AppRoutes.updateSingleMessageProp, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { _id, ...newValues } = req.body;
        const updatedDoc = await updateASingleMessageProp(messageDbService, _id, newValues);

        return res.status(200).json({ ...updatedDoc });
    } catch (error) {
        return next(error)
    }

})

router.delete(AppRoutes.deleteMessage, query('toDeleteId').exists(),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const toDeleteId = req.query['toDeleteId'] as string;

            await deleteMessage(messageDbService, toDeleteId);

            return res.status(200).json({ deletedId: toDeleteId });
        } catch (error) {
            return next(error)
        }

    })

router.get(AppRoutes.getMessagePropDefinitions, function (req: Request, res: Response, next: NextFunction) {
    try {

        const messageDefinition = getMessagePropDefinition(messageDbService);

        return res.status(200).json({ messageDefinition });
    } catch (error) {
        return next(error)
    }

})

module.exports = router;



