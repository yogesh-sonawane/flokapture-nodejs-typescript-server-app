import { Request, Response } from "express";
import { floKaptureService } from "../base-repositories/flokapture-db-service";

const addRole = function (request: Request, response: Response) {
    var roleMaster = request.body;
    var role = floKaptureService.RoleMaster.addItem(roleMaster);
    role.then(r => response.status(200).json(r)).catch(e => response.status(500).json(e));
}

const getAll = function (request: Request, response: Response) {
    var role = floKaptureService.RoleMaster.getAllDocuments();
    role.then(r => response.status(200).json(r)).catch(e => response.status(500).json(e));
}

export { addRole, getAll }  