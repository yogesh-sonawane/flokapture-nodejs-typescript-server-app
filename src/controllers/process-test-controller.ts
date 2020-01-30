import { universeMainProcessUtils } from "../helpers";
import { Request, Response } from "express";
import floKaptureService from "../base-repositories/flokapture-db-service";
import Mongoose from "mongoose";

const test = async function (request: Request, response: Response) {
    const id:string = request.query.id;
    const projectMaster = await floKaptureService.ProjectMaster.findById(id);
    if (!projectMaster) response.end();
    try {
        var res = await universeMainProcessUtils.processUniVerseFilesStep(projectMaster);
        response.status(200).json(res);
    } catch (error) {
        response.status(500).json(error);
    }
    finally {
        console.log("UniVerse file types processing step completed successfully!.");
    }
};

const aggregate = async function (request: Request, response: Response) {
    const docs = await floKaptureService.ProjectMaster.aggregate([{
        $match: {
            LanguageId: Mongoose.Types.ObjectId("5ddbb84faeee6d3bf8aea9c2")
        }
    }]);
    // const docs = await floKaptureService.LanguageMaster.aggregate([{}]);
    response.json(docs);
};

export { test, aggregate };