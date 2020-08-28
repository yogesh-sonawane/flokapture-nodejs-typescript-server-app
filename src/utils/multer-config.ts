import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { Request } from "express";
const Multer = require('multer');

let Storage = Multer.diskStorage({
    destination: function (request: Request, file: Object, cb: Function) {
        // console.log(request);
        var uploadDirName: string = request.query.uploadDirName;
        var uploadPath = join(__dirname, '../', uploadDirName);
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        };
        cb(null, uploadPath);
    },
    filename: function (request: any, file: any, cb: Function) {
        // console.log(request);
        var uploadDirName: string = request.query.uploadDirName;
        var uploadPath = join(__dirname, '../', uploadDirName);
        var completePath = join(uploadPath, file.originalname);
        request.uploadDetails = {
            FileName: file.originalname,
            UploadPath: uploadPath,
            CompletePath: completePath
        };
        cb(null, file.originalname);
    }
});
const Upload = Multer({
    storage: Storage
}).array("uploads", 12);

module.exports.multerConfig = Upload;