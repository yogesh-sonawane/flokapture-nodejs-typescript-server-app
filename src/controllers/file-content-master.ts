import floKaptureService from "../base-repositories/flokapture-db-service";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

const getDoc = function (request: Request, response: Response) {
    floKaptureService.FileContentMaster.getItem({ FileId: new ObjectId(request.query.fileId) })
        .then((res) => {
            response.status(200).json(res).end();
        }).catch((err: Error) => {
            response.status(500).json(err).end();
        });
};

export { getDoc };