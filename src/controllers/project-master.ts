import { universeUtilities, universeStringExtensions } from "../helpers"
import { Request, Response } from "express";
import Mongoose from "mongoose";
import Path from "path";
import { floKaptureService } from "../base-repositories/flokapture-db-service";
import { ProjectMaster } from "../models";
const { multerConfig } = require("../utils/multer-config");

const addProject = async function (request: Request, response: Response) {
    var pm = request.body;
    var projectMaster: any = await floKaptureService.ProjectMaster.addItem(pm);
    await addProjectProcessingSteps(projectMaster._id);
    universeUtilities.extractProjectZip(projectMaster)
        .then(async (extractPath: string) => {
            const fileName = universeStringExtensions.fileNameWithoutExtension(projectMaster.UploadDetails.FileName);
            var extractedPath = Path.join(extractPath, fileName);
            var doc = await floKaptureService.ProjectMaster.findByIdAndUpdate(projectMaster._id, {
                ExtractedPath: extractedPath
            });
            response.status(200).json(doc);
        }).catch((err: any) => {
            response.json(err);
        });
};

const getAll = async function (request: Request, response: Response) {
    var projectMaster: Array<ProjectMaster> = await floKaptureService.ProjectMaster.getAllDocuments();
    response.json(projectMaster);
};

var uploadProject = function (request: any, response: Response) {
    multerConfig(request, response, function (err: any) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
        } else {
            response.status(200).send(JSON.stringify({
                status: "File(s) uploaded successfully",
                uploadDetails: request.uploadDetails
            }));
        }
    });
};

const getProjectProcessSteps = async function (request: Request, response: Response) {
    var projectId = request.query.projectId;
    var processingSteps = await floKaptureService.ProjectProcessingSteps.getDocuments({
        ProjectId: new Mongoose.Types.ObjectId(projectId)
    });
    response.json(processingSteps);
};

const universeProcessingSteps = [{
    StepName: "ConfirmDirectoryStructure",
    StepDesc: "Confirm directory structure with necessary files",
    CanReprocess: false
}, {
    StepName: "ChangeFileExtensions",
    StepDesc: "Change file extensions depending upon directory structure like .jcl, .icd",
    CanReprocess: false
}, {
    StepName: "ExtractFileDetails",
    StepDesc: "Extract all file details in file master details table",
    CanReprocess: false
}, {
    StepName: "ExtractFileMenuData",
    StepDesc: "Extract Menu file details information",
    CanReprocess: false
}, {
    StepName: "UploadDataDictionary",
    StepDesc: "Upload Data Dictionary details",
    CanReprocess: false
}, {
    StepName: "ProcessForUniverseDescriptor",
    StepDesc: "Upload UniVerse Descriptor details",
    CanReprocess: false
}, {
    StepName: "ProcessUniVerseJcls",
    StepDesc: "Process for JCL (.jcl) files",
    CanReprocess: false
}, {
    StepName: "ProcessUniversePrograms",
    StepDesc: "Process for Program (.pgm) files",
    CanReprocess: false
}, {
    StepName: "ProcessUniVerseSubRoutinesAndIncludes",
    StepDesc: "Process for Subroutines and Includes (.sbr, .icd) files",
    CanReprocess: false
}, {
    StepName: "ProcessForFileContents",
    StepDesc: "Process for file contents like removing empty lines, commented lines etc...",
    CanReprocess: true,
    TableName: "FileContentMaster"
}];

const addProjectProcessingSteps = async function (projectId: string) {
    for (const step of universeProcessingSteps) {
        var processingStep: any = {
            ProjectId: projectId,
            StepName: step.StepName,
            StepDescription: step.StepDesc,
            StartedOn: null,
            CompletedOn: null,
            CanReprocess: step.CanReprocess,
            ReProcessDetails: {
                TableName: step.CanReprocess ? step.TableName : ""
            }
        };
        await floKaptureService.ProjectProcessingSteps.addItem(processingStep);
    }
};

export {
    addProject,
    getAll,
    getProjectProcessSteps,
    uploadProject
}