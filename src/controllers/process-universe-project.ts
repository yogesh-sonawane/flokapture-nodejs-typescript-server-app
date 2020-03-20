import { Request, Response } from "express";
import { floKaptureService } from "../base-repositories/flokapture-db-service";
import { universeMainProcessUtils, commonHelper, UniVerseUtilities, universeUtilities } from "../helpers";
import { ProjectMaster } from "../models";

const startProcessing = async function (request: Request, response: Response) {
    const project: ProjectMaster = request.body;
    const projectMaster = await floKaptureService.ProjectMaster.findById(project._id);
    if (!projectMaster) response.status(304).send("Project details not found!");
    if (!(projectMaster.ProcessingStatus === 0)) return response.status(404).json({
        status: "Project is either in process or processing!.",
        project: projectMaster
    }).end();

    await floKaptureService.ProjectMaster.findByIdAndUpdate(projectMaster._id, {
        ProcessingStatus: 2
    });

    var processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ConfirmDirectoryStructure");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        var startedOn = new Date();
        try {
            let isValid: boolean = UniVerseUtilities.validateDirStructure(projectMaster.ExtractedPath);
            if (!isValid) return response.status(500).send({
                message: "Project directory structure is not valid. Please make sure you have Menu, I-Descriptors and DataDictionary folders in it."
            }).end();
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps.findByIdAndUpdate(processStep._id, {
                StartedOn: startedOn, CompletedOn: completedOn
            });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while changing the extensions of files",
                error
            }).end();
        }
        finally {
            console.info("This message is from Change Extensions step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ChangeFileExtensions");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        var startedOn = new Date();
        try {
            await universeMainProcessUtils.changeExtensionStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps.findByIdAndUpdate(processStep._id, {
                StartedOn: startedOn, CompletedOn: completedOn
            });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while changing the extensions of files",
                error
            }).end();
        }
        finally {
            console.info("This message is from Change Extensions step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ExtractFileDetails");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        var startedOn = new Date();
        try {
            await universeMainProcessUtils.fileMasterImportStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while extracting file details information",
                error
            }).end();
        }
        finally {
            console.info("This message is from extracting file details information step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ExtractFileMenuData");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processFileMenuStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing menu file",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing menu file step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "UploadDataDictionary");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processDataDictionaryStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing data dictionary files",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing data dictionary files step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ProcessForUniverseDescriptor");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processUniverseDescriptorsStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing I-Descriptor files",
                error
            }).end();
        }
        finally {
            console.info("This message is from I-Descriptor files step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ProcessUniversePrograms");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processUniVerseFilesStep("Programs", ".pgm", projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing Universe files",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing Universe files step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ProcessUniVerseJcls");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processUniVerseFilesStep("Jcl", ".jcl", projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing Universe files",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing Universe files step");
        }
    }
    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ProcessUniVerseSubRoutinesAndIncludes");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processUniVerseFilesStep("Includes", ".icd", projectMaster);
            console.log("UniVerse Basic Include files are processed!.");
            await universeUtilities.waitForMoment(1000);
            await universeMainProcessUtils.processUniVerseFilesStep("SubRoutines", ".sbr", projectMaster);
            console.log("UniVerse Basic SubRoutine files are processed!.");
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing Universe files",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing Universe files step");
        }
    }

    processStep = await commonHelper.fetchProcessStep(projectMaster._id, "ProcessForFileContents");
    if (processStep && !processStep.StartedOn && !processStep.CompletedOn) {
        try {
            var startedOn = new Date();
            await universeMainProcessUtils.processFileContentsStep(projectMaster);
            var completedOn = new Date();
            var stepDoc = await floKaptureService.ProjectProcessingSteps
                .findByIdAndUpdate(processStep._id, { StartedOn: startedOn, CompletedOn: completedOn });
            console.log(stepDoc);
        } catch (error) {
            return response.status(500).send({
                message: "Error occurred while processing UniVerse File Contents",
                error
            }).end();
        }
        finally {
            console.info("This message is from processing UniVerse File Contents step");
        }
    }
    floKaptureService.ProjectMaster.findByIdAndUpdate(projectMaster._id, {
        ProcessingStatus: 1
    }).then((updatedProject) => {
        response.status(200).json({
            message: "Project processing completed",
            project: updatedProject
        });
    }).catch(err => {
        response.status(500).json({
            message: "Project processing completed",
            project: projectMaster,
            error: err
        });
    });
};

export { startProcessing };