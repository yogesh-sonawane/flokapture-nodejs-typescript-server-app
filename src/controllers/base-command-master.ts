import { Response, Request } from "express";
import { floKaptureService } from "../base-repositories/flokapture-db-service";
import Mongoose from "mongoose";
const addBaseCommandMaster = function (request: Request, response: Response) {
    var res = floKaptureService.BaseCommandReferenceMaster.addItem(request.body);
    res.then(extRef => response.status(200).send(extRef))
        .catch(err => response.status(500).send(err));
};

const getBaseCommandMaster = function (request: Request, response: Response) {
    var languageId = request.query.id;
    var res = floKaptureService.BaseCommandReferenceMaster.getDocuments({
        LanguageId: new Mongoose.Types.ObjectId(languageId)
    });
    res.then(extRef => response.status(200).send(extRef))
        .catch(err => response.status(500).send(err));
};

export { addBaseCommandMaster, getBaseCommandMaster }