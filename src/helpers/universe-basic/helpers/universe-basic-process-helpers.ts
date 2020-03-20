import Mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { floKaptureService } from "../../../base-repositories/flokapture-db-service";
import { ProjectMaster, UniVerseDataDictionary, BaseCommandReferenceMaster, FileTypeMaster, FileMaster } from "../../../models";
import { universeUtilities, universeStringExtensions, statementReferenceMasterHelper } from "../../";
import { FileStatics } from "../../models";
const csvParser: any = require('csv-parser');

class UniVerseBasicProcessHelpers {
    constructor() { }
    public processMenuFile = (project: ProjectMaster, filePath: string): Promise<any> => new Promise((resolve: Function, reject: Function) => {
        var rowCount = -1;
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', async (row: any) => {
                rowCount++;
                if (rowCount === 0) return;
                try {
                    const menuDetails: any = {
                        MenuId: row["Menu ID"],
                        MenuTitle: row["Menu Title"],
                        MenuDescription: row["Menu Selection and Positioning Description"],
                        ActionExecuted: row["Action Executed (JCL-Menu-Program)"],
                        UserId: Mongoose.Types.ObjectId("5df1e76ce614d70f04f3aa45"),
                        ProjectId: project._id
                    }
                    await floKaptureService.UniVerseFileMenuMaster.addItem(menuDetails);
                } catch (error) {
                    reject({ message: "Error occurred while menu file processing", error });
                }
            }).on('end', () => {
                console.log('CSV file processed successfully!.');
                resolve({ message: "Menu file processed successfully!!" });
            }).on("error", (err: any) => {
                console.error(err);
                reject({ message: "Error occurred while menu file processing" });
            });
    });
    protected prepareDataDictionary = function (row: any, project: ProjectMaster): UniVerseDataDictionary {
        const fieldNo: string = row["FIELD NO"] ? row["FIELD NO"] : "";
        var isValidNumber = /^[0-9]+(\.[0-9]+)?$/ig.test(fieldNo);
        var replacementName = isValidNumber ? "R." + row["FILE NAME"] + "(" + fieldNo + ")"
            : "K." + row["FILE NAME"];
        return {
            FileName: row["FILE NAME"] ? row["FILE NAME"] : "",
            FieldNo: fieldNo,
            Description: row["DESCRIPTION"] ? row["DESCRIPTION"] : "",
            FieldLabel: row["FIELD LABEL"] ? row["FIELD LABEL"] : "",
            RptFieldLength: row["RPT FIELD LENGTH"] ? row["RPT FIELD LENGTH"] : "",
            TypeOfData: row["TYPE OF DATA"] ? row["TYPE OF DATA"] : "",
            SingleArray: row["SINGLE/ ARRAY"] ? row["SINGLE/ ARRAY"] : "",
            DateOfCapture: row["DATE OF CAPTURE"] ? row["DATE OF CAPTURE"] : "",
            ReplacementName: replacementName,
            ProjectId: project._id
        } as UniVerseDataDictionary;
    };
    public processUniVerseDataDictionary = async (project: ProjectMaster): Promise<any> => new Promise(async (resolve: Function, reject: Function) => {
        const fastCsv: any = require("fast-csv");
        const extensionMaster: any = await floKaptureService.FileTypeMaster.getItem({
            LanguageId: new Mongoose.Types.ObjectId(project.LanguageId),
            FileTypeName: /^entity$/ig
        });
        // const extensionMaster = extRef.toObject();
        const dataDictionaries: Array<FileMaster> = await floKaptureService.FileMaster.getDocuments({
            FileTypeMasterId: extensionMaster._id,
            ProjectId: project._id,
            Processed: false
        });
        for (const file of dataDictionaries) {
            const modifiedFilePath = universeUtilities.replaceContentsForEscapeChar(file.FilePath); // Ex. "ID","Ap.key:"*":seq.nbr","Bp2010.temp"
            fs.createReadStream(modifiedFilePath).pipe(fastCsv.parse({
                headers: true
            }).on("data", async (data: any) => {
                const dataDictionary: any = this.prepareDataDictionary(data, project);
                await floKaptureService.UniVerseDataDictionaryMaster.addItem(dataDictionary);
            }).on("error", (error: any) => {
                reject({ message: "Error occurred while menu file processing", error });
            }).on("end", () => {
                console.log('All data dictionary files processed successfully!.');
                resolve({ message: "Menu file processed successfully!!" });
            }));
        }
        /*
        for (const folder of extensionMaster.FolderNames) {
            var dirPath = path.join(project.ExtractedPath, folder);
            const files = universeUtilities.getAllFilesFromPath(dirPath, []);
            for (const file of dataDictionaries) {
                const modifiedFilePath = universeUtilities.replaceContentsForEscapeChar(file.FilePath); // Ex. "ID","Ap.key:"*":seq.nbr","Bp2010.temp"
                fs.createReadStream(modifiedFilePath).pipe(fastCsv.parse({
                    headers: true
                }).on("data", async (data: any) => {
                    const dataDictionary: any = this.prepareDataDictionary(data, project);
                    await floKaptureService.UniVerseDataDictionaryMaster.addItem(dataDictionary);
                })
                .on("error", (error: any) => {
                    reject({ message: "Error occurred while menu file processing", error });
                })
                .on("end", () => {
                    console.log('All data dictionary files processed successfully!.');
                    resolve({ message: "Menu file processed successfully!!" });
                }));
            }
        }
        */
    });
    protected async processDescriptorFile(csvFile: FileMaster, delimiter: string, project: ProjectMaster): Promise<FileStatics> {
        const splitRegExp =
            new RegExp(`\\${delimiter}(?!(?<=(?:^|,)\\s*"(?:[^"]|""|\\\\")*,)(?:[^"]|""|\\\\")*"\\s*(?:,|$))`, "ig");
        const readStream = fs.readFileSync(csvFile.FilePath);
        const entityName = universeStringExtensions.fileNameWithoutExtension(path.win32.basename(csvFile.FilePath));
        const descLines = readStream.toString().split('\n');
        const headers = descLines.shift().split(splitRegExp);
        let processLineCount: number = -1;
        try {
            const idescRecordHeaders = [
                "Entity", // 0
                "StoredProcedureName", // 1
                "Type", // 2
                "DefaultReportDisplayHeading", // 3
                "DefaultFormating", // 4
                "DefaultConversion", // 5
                "ValuedAssociation", // 6
                "LongDescription", // 7
                "StatementString" // 8
            ];

            for (const descLine of descLines) {
                // console.log("==========================================");
                // await universeUtilities.waitForMoment(300);
                ++processLineCount;
                if (typeof descLine === "undefined" || descLine === null || descLine === "") continue;
                const splitedLines = descLine.split(splitRegExp);
                // var record: any = {};
                var count = -1;
                const idescRecord: any = {};
                idescRecord[idescRecordHeaders[++count]] = entityName;
                for (const header of headers) {
                    var shifted: string = splitedLines.shift() || "";
                    const recordValue: string = shifted.replace(/\n/ig, '').trim();
                    // record[header] = recordValue;
                    idescRecord[idescRecordHeaders[++count]] = recordValue;
                };
                idescRecord["ProjectId"] = project._id;
                // console.log(idescRecord);
                await floKaptureService.UniVerseDescriptorMaster.addItem(idescRecord);
            }
            const fileStatics: FileStatics = {
                lineCount: descLines.length,
                processedLineCount: processLineCount,
                parsed: true,
                exceptions: null
            };

            await floKaptureService.FileMaster.findByIdAndUpdate(csvFile._id, {
                FileStatics: fileStatics,
                Processed: true
            });
            return fileStatics;
        } catch (error) {
            let fileStatics: FileStatics = {
                lineCount: descLines.length,
                processedLineCount: processLineCount,
                parsed: false,
                exceptions: error
            };
            await floKaptureService.FileMaster.findByIdAndUpdate(csvFile._id, {
                FileStatics: fileStatics,
                Processed: true
            });
            return fileStatics;
        } finally { }
    };
    public processUniverseDescriptors = (project: ProjectMaster): Promise<any> => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const extensionMaster: FileTypeMaster = await floKaptureService.FileTypeMaster.getItem({
                LanguageId: new Mongoose.Types.ObjectId(project.LanguageId),
                FileTypeName: /descriptor$/ig
            });
            // Following delimiter character needs to be taken from database
            // This should be configured in file type extension master table.
            // If not, then stop processing and ask user to configure it before processing I-Descriptor files.
            const idescFiles: Array<FileMaster> = await floKaptureService.FileMaster.getDocuments({
                FileTypeMasterId: extensionMaster._id,
                ProjectId: project._id,
                Processed: false
            });
            const delimiter: string = extensionMaster.Delimiter;
            for (const descFile of idescFiles) {
                await this.processDescriptorFile(descFile, delimiter, project);
                await universeUtilities.waitForMoment(200);
            }
            /* 
            for (const folder of extensionMaster.FolderNames) {
                var dirPath = path.join(project.ExtractedPath, folder);
                const descFiles = universeUtilities.getAllFilesFromPath(dirPath, []);
                for (const descFile of idescFiles) {
                    await this.processDescriptorFile(descFile.FilePath, delimiter, project);
                    await universeUtilities.waitForMoment(200);
                }
            }
            */
            resolve({ message: "I-Descriptor files processed successfully!!" });
        } catch (error) {
            reject({ message: "Error occurred while I-Descriptor files processing!", error });
        }
    });
    public processUniVerseFileTypes = (type: string, extension: string, project: ProjectMaster): Promise<any> => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const baseCommandReferences: BaseCommandReferenceMaster[] = await floKaptureService.BaseCommandReferenceMaster.getDocuments({
                LanguageId: project.LanguageId
            });
            const baseCommands = await floKaptureService.BaseCommandMaster.getAllDocuments();
            for (const baseCommandRef of baseCommandReferences) {
                const fileMasters = await floKaptureService.FileMaster.getDocuments({
                    ProjectId: project._id,
                    FileTypeMasterId: baseCommandRef.FileTypeMasterId,
                    Processed: false
                } as Partial<FileMaster>);

                for (const fileMaster of fileMasters) {
                    if (!(fileMaster.FileTypeMaster.FileTypeName === type && fileMaster.FileTypeMaster.FileTypeExtension === extension)) continue;
                    await statementReferenceMasterHelper.processUniVerseFile(baseCommands, baseCommandRef, fileMaster);
                    await universeUtilities.waitForMoment(200);
                }
            }
            resolve({ message: "All files/objects are processed.", project });
        } catch (error) {
            reject({ message: "Error occurred while processing files.", error });
        }
    });
    public processFileContentMaster = (project: ProjectMaster): Promise<any> => new Promise(async (resolve: Function, reject: Function) => {
        try {
            const baseCommandReferences: BaseCommandReferenceMaster[] = await floKaptureService.BaseCommandReferenceMaster.getDocuments({
                LanguageId: project.LanguageId
            });
            const baseCommands = await floKaptureService.BaseCommandMaster.getAllDocuments();
            for (const baseCommandRef of baseCommandReferences) {
                const fileMasters = await floKaptureService.FileMaster.getDocuments({
                    ProjectId: project._id,
                    FileTypeMasterId: baseCommandRef.FileTypeMasterId,
                    Processed: true
                });

                for (const fileMaster of fileMasters) {
                    if (fileMaster.FileTypeMaster.FileTypeName === "Menu" || fileMaster.FileTypeMaster.FileTypeName === "Entity" || fileMaster.FileTypeMaster.FileTypeName === "I-Descriptor" || /^.txt$|^.csv$/.test(fileMaster.FileTypeMaster.FileTypeExtension)) continue;
                    await statementReferenceMasterHelper.processFileContents(fileMaster);
                    await universeUtilities.waitForMoment(100);
                }
            }
            resolve({ message: "File content master processing step completed successfully.", project });
        } catch (error) {
            reject({ message: "Error occurred while processing file content master step.", error });
        }
    });
}

const universeBasicProcessHelpers: UniVerseBasicProcessHelpers = new UniVerseBasicProcessHelpers();

export { universeBasicProcessHelpers, UniVerseBasicProcessHelpers };