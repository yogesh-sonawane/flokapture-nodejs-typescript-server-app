console.clear();
const globalAny: any = global;
import https from "https";
import Express from 'express';
import { json, urlencoded } from 'body-parser';
import Cors from 'cors';
import { join, resolve } from 'path';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import "./database/mongoose-database-config";
import mongoDbServer from "./database/mongodb-database-config";

console.log('=======================================================================');

async function mongoConnection() {
    globalAny.mongoDbConnection = await mongoDbServer();
};

Promise.resolve(mongoConnection()).then(() => {
    // console.log('=======================================================================');
    var App = Express();
    App.use(json({ limit: '60mb' }));
    App.use(urlencoded({ limit: '60mb', extended: true }));
    App.use(Cors());
    App.get('/get-status', function (request, response) {
        response.status(200).end('Flokapture Server Application is up and running.!!!');
    });
    App.get('', function (request, response) {
        response.status(200).end('Flokapture Server Application is up and running!!!');
    });

    var ExpressPath: any = require('express-path');
    var AppRoutes: any = require("./routes/app-routes");
    ExpressPath(App, AppRoutes);

    var uploadPath = join(__dirname, 'file-uploads');
    if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
    };
    var crtPath = resolve(__dirname, "certificates");
    var httpsOptions = {
        cert: readFileSync(join(crtPath, "device.crt")),
        key: readFileSync(join(crtPath, "device.key"))
    };
    App.use(Express.static(uploadPath));
    var expressHttpsServer = https.createServer(httpsOptions, App);
    var portNumber = process.env.PORT || 4000;
    expressHttpsServer.listen(portNumber, function () {
        var address: any = this.address();
        if (!globalAny.dbConnection) {
            console.log("==========================================================================");
            console.log(`Database connection failed!!!.  `);
            console.log("==========================================================================");
        }
        console.log('=========================================================================');
        console.log(`Flokapture Server Host Application is up running on port: ${portNumber}`);
        console.log(address);
        console.log('=========================================================================');
    });
}).catch((error) => {
    console.log(error);
});
