import Mongoose from "mongoose";
import fs from "fs";
import path from "path";
import {floKaptureService} from "../../../base-repositories/flokapture-db-service";
import { commonHelper, universeUtilities, universeBasicProcessHelpers } from "../../index";
import { FileMaster, ProjectMaster } from "../../../models";

export default class UniVerseMainProcessUtils {
    constructor() { };
    public changeExtensionStep = (project: ProjectMaster) => new Promise((resolve: Function, reject: Function) => {
        try {
            const extRefPromise = floKaptureService.FileTypeMaster.getDocuments({
                LanguageId: new Mongoose.Types.ObjectId(project.LanguageId)
            });
            extRefPromise.then(function (fileTypeMaster) {
                fileTypeMaster.forEach(function (fileType: any) {
                    commonHelper.changeExtensions(project.ExtractedPath, fileType.FileTypeExtension, fileType.FolderNames);
                });
                resolve();
            });
            extRefPromise.catch(function (err: Mongoose.Error) {
                reject();
            });
        } catch (error) {
            reject(error)
        }
    });
    public fileMasterImportStep = (project: ProjectMaster) => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const fileTypeMaster = await floKaptureService.FileTypeMaster
                .getDocuments({ LanguageId: new Mongoose.Types.ObjectId(project.LanguageId) });
            const rootPath: string = project.ExtractedPath;
            if (!fs.existsSync(rootPath)) resolve();
            const rootDirectories = fs.readdirSync(rootPath);
            for (const dir of rootDirectories) {
                const dirInfo: any = {
                    ProjectId: project._id,
                    RootPath: rootPath,
                    DirName: dir,
                    DirCompletePath: path.join(rootPath, dir)
                };
                await floKaptureService.ProjectDirInfo.addItem(dirInfo)
            }
            const files: string[] = universeUtilities.getAllFilesFromPath(rootPath, []);
            for (const file of files) {
                var fileMaster: FileMaster = commonHelper.prepareFileMasterObject(file, project, fileTypeMaster);
                await floKaptureService.FileMaster.addItem(fileMaster);
            }
            resolve(files);
        } catch (error) {
            reject(error);
        }
    });
    public processFileMenuStep = (project: ProjectMaster) => new Promise(async (resolve: Function, reject: Function) => {
        try {
            var menuFilePath = path.join(project.ExtractedPath, "Menu", "MENUS.csv");
            var res: Promise<any> = await universeBasicProcessHelpers.processMenuFile(project, menuFilePath);
            resolve(res);
        } catch (error) {
            reject({ message: "Error occurred while menu file processing", error });
        }
        finally {

        }
    });
    public processDataDictionaryStep = (project: ProjectMaster) => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const res: Promise<any> = await universeBasicProcessHelpers.processUniVerseDataDictionary(project);
            resolve(res);
        } catch (error) {
            reject({ message: "Error occurred while data dictionary files processing!", error });
        }
        finally {
            console.log("Data dictionary files processing step completed successfully!.");
        }
    });
    public processUniverseDescriptorsStep = (project: ProjectMaster) => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const res: unknown = await universeBasicProcessHelpers.processUniverseDescriptors(project);
            resolve(res);
        } catch (error) {
            reject({ message: "Error occurred while I-Descriptor files processing!", error });
        }
        finally {
            console.log("I-Descriptor files processing step completed successfully!.");
        }
    });
    public processUniVerseFilesStep = (project: ProjectMaster) => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const res: any = await universeBasicProcessHelpers.processUniVerseFileTypes(project);
            resolve(res);
        } catch (error) {
            reject({ message: "Error occurred while UniVerse file types processing!", error });
        }
        finally {
            console.log("UniVerse file types processing step completed successfully!.");
        }
    });
}

const universeMainProcessUtils: UniVerseMainProcessUtils = new UniVerseMainProcessUtils();
export { universeMainProcessUtils, UniVerseMainProcessUtils };