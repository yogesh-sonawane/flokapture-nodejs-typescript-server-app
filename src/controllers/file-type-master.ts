import { Request, Response } from "express";
import floKaptureService from "../base-repositories/flokapture-db-service";

const addFileTypeMaster = function (request: Request, response: Response) {
    var fileTypeMaster = request.body;
    var promise = floKaptureService.FileTypeMaster.addItem(fileTypeMaster);
    promise.then(doc => {
        response.status(200).json(JSON.stringify(doc)).end();
    }).catch(err => {
        response.status(500).json(JSON.stringify(err)).end();
    });
};

const getAll = function (request: Request, response: Response) {
    var promise = floKaptureService.FileTypeMaster.getAllDocuments();
    promise.then(docs => {
        response.status(200).json(docs).end();
    }).catch(err => {
        response.status(500).json(err).end();
    });
};

const getDocuments = function (request: Request, response: Response){
    const filter = request.body;
    const promise = floKaptureService.FileTypeMaster.getDocuments(filter);
    promise.then(docs => {
        response.status(200).json(docs).end();
    }).catch(err => {
        response.status(500).json(err).end();
    });
};

module.exports = {
    addFileTypeMaster,
    getAll,
    getDocuments
};
