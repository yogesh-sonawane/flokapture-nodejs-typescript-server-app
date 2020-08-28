var UnZipper: any = require("unzipper");
import fs from "fs";
import path from "path";
import { LineDetails } from "../../models";
import { universeStringExtensions } from "../../";

class UniVerseUtilities {
    public extractProjectZip = function (projectMaster: any) {
        return new Promise((resolve, reject) => {
            var filePath = path.relative("dist", __dirname);
            var srcPath = __dirname.replace(filePath, "");
            var extractPath = path.join(srcPath, "ExtractedProjects");
            if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath);
            fs.createReadStream(projectMaster.UploadDetails.CompletePath)
                .pipe(UnZipper.Extract({
                    path: extractPath
                }))
                .on("error", (err: any) => {
                    reject({
                        message: "Error occurred while extracting .zip",
                        project: JSON.stringify(projectMaster),
                        error: JSON.stringify(err)
                    });
                }).on("end", () => {
                    resolve(extractPath);
                });
            resolve(extractPath);
        });
    };
    static validateDirStructure = function (rootPath: string) {
        const dirNames = ["Menu", "I-Descriptors", "DataDictionary"];
        if (!fs.existsSync(rootPath)) return false;

        var allDirectories = fs.readdirSync(rootPath);
        var exist = false;
        for (const dir of dirNames) {
            exist = allDirectories.includes(dir);
            if (!exist) break;
            exist = true;
        }
        return exist;
    };
    static fileNameWithoutExtension = function (path: string) {
        var fileName = path.split('.').slice(0, -1).join('.');
        return fileName;
    };
    static fileExtensionOnly = function (path: string): string {
        if (typeof path === "undefined" || path === "" || path === null) return "";
        try {
            const regEx = /\.[^.]+$/;
            const extension = regEx.exec(path).pop();
            return extension;
        } catch (error) {
            console.error(error);
            return ""
        }
    };
    static changeExtension = function (dirPath: string, ext: string) {
        var allFiles = fs.readdirSync(dirPath);
        allFiles.forEach(function (file) {
            var oldPath = path.join(dirPath, file);
            var basename = path.basename(oldPath);
            if (!(basename.lastIndexOf(ext) === -1)) return;
            var newPath = path.join(dirPath, file).concat(ext);
            // console.log(newPath);
            fs.renameSync(oldPath, newPath);
        });
    };
    public getAllFilesFromPath = function (rootPath: string, files: string[]): string[] {
        files = files || [];
        if (!fs.existsSync(rootPath)) return [];
        const dirOrFiles = fs.readdirSync(rootPath);
        for (const dir of dirOrFiles) {
            const dPath = path.join(rootPath, dir);
            const stats = fs.statSync(dPath);
            if (stats.isDirectory())
                files = this.getAllFilesFromPath(dPath, files);
            else
                files.push(dPath);
        }
        return files;
    };
    public replaceContentsForEscapeChar = function (filePath: string): string {
        var fileBuffer = fs.readFileSync(filePath).toString().split("\n");
        var lineArray = "";
        fileBuffer.forEach(function (line) {
            var stringArray: string[] = [];
            if (typeof line === "undefined" || line === "" || !line) return;
            line.split(/\,(?!(?<=(?:^|,)\\s*"(?:[^"]|""|\\")*,)(?:[^"]|""|\\")*"\\s*(?:,|$))/)
                .forEach(function (match) {
                    stringArray.push(match);
                });
            lineArray += stringArray.join(",").concat('\n');
        });
        const fileName = path.basename(filePath);
        const modifiedFile = `modified-${fileName}`;
        const dirName = path.dirname(filePath);
        const modifiedFilePath = path.join(dirName, modifiedFile);
        fs.writeFileSync(modifiedFilePath, lineArray);
        return modifiedFilePath;
    };
    public processLocateStatements = function (fileLines: Array<LineDetails>): Array<LineDetails> {
        if (fileLines.length <= 0) return fileLines;
        // let linePosition: number = -1;
        let fileLinesArray: Array<LineDetails> = [];
        let locateRegEx = new RegExp("^[\\s]+LOCATE\\s+|^LOCATE\\s+", "i");
        for (const fileLine of fileLines) {
            // linePosition++;
            if (!locateRegEx.test(fileLine.parsedLine)) {
                fileLinesArray.push(fileLine);
                continue;
            }
            if (fileLine.parsedLine.endsWith(" ELSE")) {
                var modify = fileLine.parsedLine.replace("ELSE", "").trimRight();
                var whiteSpaces = fileLine.parsedLine.search(/\S/) + 22;
                fileLinesArray.push({ lineIndex: fileLine.lineIndex, originalLine: fileLine.originalLine, parsedLine: modify, businessName: fileLine.businessName, referenceFileId: fileLine.referenceFileId, statementComment: fileLine.statementComment });
                let paddedLine = "IF NOT-SUCCESS THEN".padStart(whiteSpaces, " ");
                fileLinesArray.push({ lineIndex: fileLine.lineIndex, originalLine: fileLine.originalLine, parsedLine: paddedLine, businessName: fileLine.businessName, referenceFileId: fileLine.referenceFileId, statementComment: fileLine.statementComment });
                continue;
            }
            if (fileLine.parsedLine.endsWith("THEN")) {
                var modify = fileLine.parsedLine.replace("THEN", "").trimRight();
                var whiteSpaces = fileLine.parsedLine.search(/\S/) + 18;
                fileLinesArray.push({ lineIndex: fileLine.lineIndex, originalLine: fileLine.originalLine, parsedLine: modify, businessName: fileLine.businessName, referenceFileId: fileLine.referenceFileId, statementComment: fileLine.statementComment });
                let paddedLine = "IF SUCCESS THEN".padStart(whiteSpaces, " ");
                fileLinesArray.push({ lineIndex: fileLine.lineIndex, originalLine: fileLine.originalLine, parsedLine: paddedLine, businessName: fileLine.businessName, referenceFileId: fileLine.referenceFileId, statementComment: fileLine.statementComment });
            }
        }
        return fileLinesArray;
    };
    public processCaseStatements = function (lineDetails: Array<LineDetails>): Array<LineDetails> {
        let fileLinesArray: Array<LineDetails> = [];
        let beginCaseRegExp = new RegExp("^\\s+BEGIN CASE|^BEGIN CASE$", "igm");
        let endCaseRegExp = new RegExp("^\\s+END CASE|^END CASE$", "igm");
        let caseOtherwiseRegExp = new RegExp("^\\s+CASE OTHERWISE|^CASE OTHERWISE$", "igm");
        // let caseStatementRegExp = new RegExp("^\\s+CASE\\s+|^CASE\\s+", "igm");
        let linePosition = -1;
        let caseCounter = 0;
        for (const lineDetail of lineDetails) {
            if (beginCaseRegExp.test(lineDetail.parsedLine)) {
                caseCounter = 0;
                continue;
            }
            linePosition++;
            if (endCaseRegExp.test(lineDetail.parsedLine)) {
                caseCounter = 0;
                fileLinesArray.push({
                    lineIndex: lineDetail.lineIndex, originalLine: "END", parsedLine: "END"
                });
                continue;
            }
            if (caseOtherwiseRegExp.test(lineDetail.parsedLine)) {
                fileLinesArray.push({
                    lineIndex: lineDetail.lineIndex, originalLine: "END ELSE", parsedLine: "END ELSE", statementComment: lineDetail.statementComment
                });
                continue;
            }
            if (/^\s+CASE\s+|^CASE\s+/igm.test(lineDetail.parsedLine) && caseCounter === 0) {
                let ld: LineDetails = universeStringExtensions.getCommentAndStatement(lineDetail);
                let statement = ld.parsedLine.replace(/case\s+/i, "IF ") + " THEN";
                fileLinesArray.push({
                    lineIndex: lineDetail.lineIndex, originalLine: lineDetail.originalLine, parsedLine: statement, businessName: ld.businessName, referenceFileId: ld.referenceFileId, statementComment: ld.statementComment
                });
                caseCounter++;
                continue;
            }
            if (/^\s+CASE\s+|^CASE\s+/igm.test(lineDetail.parsedLine) && caseCounter >= 1) {
                let ld: LineDetails = universeStringExtensions.getCommentAndStatement(lineDetail);
                let statement = ld.parsedLine.replace(/case\s+/i, "IF ") + " THEN";
                fileLinesArray.push({
                    lineIndex: linePosition, originalLine: "END", parsedLine: "END"
                });
                fileLinesArray.push({
                    lineIndex: lineDetail.lineIndex, originalLine: lineDetail.originalLine, parsedLine: statement, businessName: ld.businessName, referenceFileId: ld.referenceFileId, statementComment: ld.statementComment
                });
                caseCounter++;
                continue;
            }
            fileLinesArray.push({
                lineIndex: lineDetail.lineIndex, originalLine: lineDetail.originalLine, parsedLine: lineDetail.parsedLine, businessName: lineDetail.businessName, referenceFileId: lineDetail.referenceFileId, statementComment: lineDetail.statementComment
            });
        }
        return fileLinesArray;
    };
    public waitForMoment = (milliseconds: number): Promise<unknown> => new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
const universeUtilities: UniVerseUtilities = new UniVerseUtilities();
export { universeUtilities, UniVerseUtilities };