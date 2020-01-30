import { Request, Response } from "express";
import floKaptureService from "../base-repositories/flokapture-db-service";
import {
    changeExtensionStep, fileMasterImportStep, processFileMenuStep,
    processDataDictionaryStep, processUniverseDescriptorsStep
} from "../helpers";
import Mongoose from "mongoose";


const startProcessing = async function (request: Request, response: Response) {
    const id: string = request.query.id;
    const projectMaster = await floKaptureService.ProjectMaster.findById(id);
    if (!projectMaster) response.status(304).send("Project details not found!");
    var processStep = await fetchProcessStep(projectMaster._id, "ChangeFileExtenstions");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        var startedOn = new Date();
        try {
            await changeExtensionStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps.findByIdAndUpdate(processStep._id, {
                StartedOn: startedOn, CompletedOn: completedOn
            });
            console.log(stepDoc);
        } catch (error) {
            response.status(500).send({
                message: "Error occured while changing the extensions of files",
                error
            }).end();
        }
        finally {
            console.info("This message is from Change Extensions step");
        }
    }
    processStep = await fetchProcessStep(projectMaster._id, "ExtractFileDetails");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        var startedOn = new Date();
        try {
            await fileMasterImportStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            response.status(500).send({
                message: "Error occured while extracting file details information",
                error
            }).end();
        }
        finally {
            console.info("This message is from extracting file details information step");
        }
    }
    processStep = await fetchProcessStep(projectMaster._id, "ExtractFileMenuData");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await processFileMenuStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            response.status(500).send({
                message: "Error occured while processing menu file",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing menu file step");
        }
    }
    processStep = await fetchProcessStep(projectMaster._id, "UploadDataDictionary");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await processDataDictionaryStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occured while processing data dictionary files",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing data dictionary files step");
        }
    }
    processStep = await fetchProcessStep(projectMaster._id, "ProcessForUniverseDescriptor");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await processUniverseDescriptorsStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occured while processing I-Descriptor files",
                error
            }).end();
        }
        finally {
            console.info("This message is from I-Descriptor files step");
        }
    }
    response.status(200).json({
        message: "Project processing completed",
        project: projectMaster
    });
};

const fetchProcessStep = async function (projectId: string, stepName: string): Promise<any> {
    var step = await floKaptureService.ProjectProcessingSteps.getItem({
        ProjectId: new Mongoose.Types.ObjectId(projectId),
        StepName: stepName
    });
    return !step ? null : step;
};

export { startProcessing };