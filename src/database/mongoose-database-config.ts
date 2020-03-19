const globalAny: any = global;
import Mongoose from "mongoose";
import { readFileSync } from "fs";
import { join, resolve } from 'path';

const mongoPort = 27000;
const userName = "yogeshs";
const password = "yogeshs";
const mongoHost = "localhost";
const databaseName = "flokapturedb";
const mongoDbUrl = `mongodb://${mongoHost}:${mongoPort}/?ssl=true`;

var crtPath = resolve(__dirname, "../", "certificates");
const mongoDbOpt: Mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    sslValidate: false,
    autoIndex: false,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    sslKey: readFileSync(join(crtPath, "mongodb.pem")),
    sslCert: readFileSync(join(crtPath, "mongodb-cert.crt")),
    dbName: databaseName,
    family: 4,
    readPreference: "secondary",
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoReconnect: false,
    auth: {
        user: userName,
        password: password
    },
    useUnifiedTopology: true, // Use this parameter option later... DeprecationWarning ignored
    useFindAndModify: false
};

const dbServer = function () {
    Mongoose.Promise = global.Promise;
    return Mongoose.createConnection(mongoDbUrl, mongoDbOpt)    
        .on("connected", function () {
            console.log("Database connection succeeded!!");
            console.log('=======================================================================');
        }).on("disconnected", function () {
            console.log("Database connection has been disconnected!!");
            console.log('=======================================================================');
        }).on("close", function () {
            console.log("Database connection is closed!!");
            console.log('=======================================================================');
        }).on("error", function () {
            console.log("Database connection failed!!");
            console.log('=======================================================================');
        });
};
const dbConnection: Mongoose.Connection = dbServer();
exports.dbConnection = globalAny.dbConnection = dbConnection;
