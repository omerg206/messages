const mongoose = require("mongoose");// connect your database
import { connect } from 'mongoose'
import { configService } from '../services/config-service';




export async function connectToMongoDb(): Promise<void> {
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to atlas');
    });

    mongoose.connection.on('error', function (err: any) {
        console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    try {
        await connect(configService.config.mongoUrl, { checkKeys: true });
    } catch (error) {
        console.log('connect error', error)
    }

}



