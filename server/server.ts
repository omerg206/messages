import { MessageModel } from './db/messages/message-schema';
import { connectToMongoDb } from "./db/db-connection";
import { errorHandlerMiddleware } from "./middlewares/error.middleware";
import { configService } from "./services/config-service";
import { AppRoutes } from '../shared/routes.model';




const routes = require('./routes/messages.route')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(errorHandlerMiddleware)
app.use(AppRoutes.endPoint, routes)

async function main() {
    await connectToMongoDb();

    app.listen(configService.config.expressPort, function () {
        console.log(`CORS-enabled web server listening on port ${configService.config.expressPort}`)
    })

   }



main();



