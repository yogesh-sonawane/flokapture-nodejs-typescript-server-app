import { Request, Response } from "express";
import floKaptureService from "../base-repositories/flokapture-db-service";

const getAll = async function (request: Request, response: Response) {
    const fileMaster = await floKaptureService.FileMaster.getAllDocuments(30);
    response.status(200).json(fileMaster);
};

const getDocuments = function (request: Request, response: Response) {
    const filter: object = {
        FileTypeMasterId: request.body.FileTypeMasterId,
        FileNameWithoutExt: new RegExp(request.body.FileNameWithoutExt, 'i')
    };
    
    floKaptureService.FileMaster.getDocuments(filter).then((res) => {
        response.status(200).json(res);
    }).catch((error: Error) => {
        response.status(500).json(error);
    });
};

export { getAll, getDocuments }