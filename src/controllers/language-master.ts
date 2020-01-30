import { Request, Response } from "express";
import floKaptureService from "../base-repositories/flokapture-db-service";

const getAllLanguages = async function (request: Request, response: Response) {
    var languageMasters = await floKaptureService.LanguageMaster.getAllDocuments();
    response.status(200).json(languageMasters).end();
};
const addLanguage = function (request: Request, response: Response) {
    var languageMaster = request.body;
    var promise = floKaptureService.LanguageMaster.addItem(languageMaster);
    promise.then(doc => {
        response.status(200).json(JSON.stringify(doc)).end();
    }).catch(err => {
        response.status(500).json(JSON.stringify(err)).end();
    });
};

const deleteItem = function (request: Request, response: Response) {
    var id = request.query.id;
    var docQuery = floKaptureService.LanguageMaster.remove(id);
    docQuery.then(res => {
        response.status(200).json(res).end();
    }).catch(err => {
        response.status(500).json(err).end();
    });
}

const findById = async function (request: Request, response: Response) {
    var languageId = 1;
    var languageMaster = await floKaptureService.LanguageMaster.getItem({
        LanguageId: languageId
    });
    response.status(200).json(languageMaster).end();
};


module.exports = {
    getAllLanguages,
    addLanguage,
    findById,
    deleteItem
}