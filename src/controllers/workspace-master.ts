import { Request, Response } from "express";
import floKaptureService from "../base-repositories/flokapture-db-service";

const getAll = async function (request: Request, response: Response) {
    const workspaces = await floKaptureService.WorkspaceMaster.getAllDocuments();
    response.json(workspaces);
};
const addWorkspace = async function (request: Request, response: Response) {
    var wp = request.body;
    const workspace = await floKaptureService.WorkspaceMaster.addItem(wp);
    response.json(workspace);
};

export { getAll, addWorkspace };