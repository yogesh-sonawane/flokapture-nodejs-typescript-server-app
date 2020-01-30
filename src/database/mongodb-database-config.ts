const globalAny: any = global;
import Mongoose from "mongoose";
import { readFileSync } from "fs";
import { join, resolve } from 'path';
import { MongoClient, Db } from "mongodb";

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
    // autoIndex: false,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    sslKey: readFileSync(join(crtPath, "mongodb.pem")),
    sslCert: readFileSync(join(crtPath, "mongodb-cert.crt")),
    // dbName: databaseName,
    family: 4,
    readPreference: "secondary",
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoReconnect: false,
    auth: {
        user: userName,
        password: password
    },
    useUnifiedTopology: true, // Use this paramenter option later... DeprecationWarning ignored
    // useFindAndModify: false
};

const mongoDbServer = () => new Promise((resolve: Function, reject: Function) => {
    const mongoClient: MongoClient = new MongoClient(mongoDbUrl, mongoDbOpt);
    mongoClient.on("connect", function () {
        console.log("Database connection with MongoDb Driver succeded!!");
        console.log('=======================================================================');
    });

    /*
    const client: MongoClient = mongoClient.connect() as unknown as MongoClient;
    globalAny.mongoDbClient = mongoClient as MongoClient;
    mongoClient.emit("connect");
    const dbConnection: Db = client.db(databaseName);
    globalAny.mongoDbConnection = dbConnection as Db;
    return dbConnection;
    */

    mongoClient.connect().then((client) => {
        globalAny.mongoDbClient = mongoClient as MongoClient;
        mongoClient.emit("connect");
        const dbConnection: Db = client.db(databaseName);
        resolve(dbConnection);
    }).catch((error) => {
        console.log(error);
    });
});

export default mongoDbServer;

/*
(async function mongoConnection() {
    globalAny.mongoDbConnection = await mongoDbServer();
})();
*/