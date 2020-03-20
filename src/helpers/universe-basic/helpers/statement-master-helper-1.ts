import fs from "fs";
import { LineDetails, FileStatics } from "../../models";
import { StatementReferenceMaster, FileMaster, FileContentMaster, BaseCommandReferenceMaster, BaseCommandMaster } from "../../../models";
import { floKaptureService } from "../../../base-repositories/flokapture-db-service";
import { universeStringExtensions, universeUtilities, universeArrayExtensions } from "../../../helpers";

export class StatementReferenceMasterHelper {
    constructor() { };
    prepareStatementReferenceMaster = (lineDetail: LineDetails, baseCommandRef: BaseCommandMaster, fileMaster: FileMaster): StatementReferenceMaster => {
        try {
            const statementReferenceMaster = Object.assign({}, {
                OriginalStatement: lineDetail.originalLine,
                ResolvedStatement: lineDetail.parsedLine,
                StatementComment: lineDetail.statementComment,
                BaseCommandId: baseCommandRef.BaseCommandId === 0 ? null : baseCommandRef._id,
                FileId: fileMaster._id,
                ProjectId: fileMaster.ProjectId,
                MethodName: baseCommandRef.BaseCommandId === 8 ? lineDetail.parsedLine : "",
                BusinessName: baseCommandRef.BaseCommandId === 8 ? lineDetail.businessName : "",
                ReferenceFileId: lineDetail.referenceFileId,
                AlternateName: null
            });
            return statementReferenceMaster as unknown as StatementReferenceMaster;
        } catch (error) {
            console.log(error);
        }
    };
    getMethodBusinessName = function (lineDetail: LineDetails, fileContents: string[], lineComment: string): LineDetails {
        const lineIndex = lineDetail.lineIndex;
        if (lineIndex <= 0) return lineDetail;
        var businessName = "";
        for (var index = lineIndex; index >= lineIndex - 4; index--) {
            const line = fileContents[index].trim();
            if (/^[\*\s]+$/.test(line)) continue;
            if (!line.startsWith(lineComment)) continue;
            businessName = line.split(lineComment).reverse().shift().trim();
            break;
        }
        lineDetail.businessName = businessName;
        return lineDetail;
    };
    extractBaseCommandId = (statementToParse: string, baseCommandMaster: BaseCommandReferenceMaster, baseCommands: BaseCommandMaster[]): BaseCommandMaster | null => {
        if (universeStringExtensions.checkStatement(statementToParse)) return null;

        const ifPattern = baseCommandMaster.IfStart.join("|");
        const callExtPattern = baseCommandMaster.CallExternal.join("|");
        const loopStartPattern = baseCommandMaster.Loop.Start.join("|");
        const endIfPattern = baseCommandMaster.IfEnd.join("|");
        const loopEndPattern = baseCommandMaster.Loop.End.join("|");
        const elseBlockPattern = baseCommandMaster.ElseBlock;
        const callIntPattern = baseCommandMaster.CallInternal.join("|");
        const methodStartPattern = baseCommandMaster.MethodOrParagraph.Start.join("|");
        const methodEndPattern = baseCommandMaster.MethodOrParagraph.End;

        var regExEndIf = new RegExp(endIfPattern, "ig");
        var regExLoopStart = new RegExp(loopStartPattern, "ig");
        var regExLoopEnd = new RegExp(loopEndPattern, "ig");
        var regExIfStart = new RegExp(ifPattern, "ig");
        var regExElse = new RegExp(`^END ELSE$|^${elseBlockPattern}$`, "ig");
        var regExCallExt = new RegExp(callExtPattern, "ig");
        var regExCallInt = new RegExp(callIntPattern, "ig");
        const regExMethodStart = new RegExp(methodStartPattern, "ig");
        const regExMethodEnd = new RegExp(methodEndPattern, "ig");

        const trimedStatement = statementToParse.trim();
        var baseCommand: BaseCommandMaster = regExIfStart.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "IF Start") : { BaseCommandId: 0, BaseCommand: "", _id: null } as BaseCommandMaster;
        baseCommand = regExLoopStart.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Loop Start") : baseCommand;
        baseCommand = regExLoopEnd.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Loop End") : baseCommand;
        baseCommand = regExEndIf.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "IF End") : baseCommand;
        baseCommand = regExElse.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Else Block") : baseCommand;
        baseCommand = regExCallExt.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Call External") : baseCommand;
        baseCommand = regExCallInt.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Call Internal") : baseCommand;
        baseCommand = regExMethodStart.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Method Start") : baseCommand;
        baseCommand = regExMethodEnd.test(trimedStatement) ? baseCommands.find(bc => bc.BaseCommand === "Method End") : baseCommand;

        return baseCommand;
    };
    printFileStatics = function (lstBaseCommands: BaseCommandMaster[], fileMaster: any) {
        console.log("==========================================================");
        const ifCount = lstBaseCommands.filter(b => b.BaseCommandId === 1);
        const endIfCount = lstBaseCommands.filter(b => b.BaseCommandId === 2);
        const callExtCount = lstBaseCommands.filter(b => b.BaseCommandId === 6);
        const callIntCount = lstBaseCommands.filter(b => b.BaseCommandId === 5);
        const elseCount = lstBaseCommands.filter(b => b.BaseCommandId === 10);
        const methodStartCount = lstBaseCommands.filter(b => b.BaseCommandId === 8);
        const methodEndCount = lstBaseCommands.filter(b => b.BaseCommandId === 9);
        console.log({
            "If Statements: ": ifCount.length,
            "End If Statements: ": endIfCount.length,
            "Else Statements: ": elseCount.length,
            "Call External Statements: ": callExtCount.length,
            "Call Internal Statements: ": callIntCount.length,
            "Method Start Statements: ": methodStartCount.length,
            "Method End Statements: ": methodEndCount.length,
            "File Name: ": fileMaster.FileName,
            "Type: ": fileMaster.FileTypeMaster.FileTypeName
        });
        console.log("==========================================================");
    };
    matchAll = function* (inputString: string, regExp: RegExp) {
        const flags = regExp.global ? regExp.flags : regExp.flags + "g";
        const regularExpression = new RegExp(regExp, flags);
        let match: RegExpExecArray;
        while (match = regularExpression.exec(inputString)) {
            yield match;
        }
    };
    extractUniVerseFileName = (lineDetail: LineDetails): string => {
        var callRegEx = new RegExp(/^CALL\s+(.*?(?=\())/, "ig");
        var phExePhantomRegEx = new RegExp(/^[EXECUTE\s+|PH\s+|PHANTOM\s+]+(.*)/, "ig");
        var includeInsertRegEx = new RegExp(/([a-zA-Z0-9\.\\_]+$)/, "ig");
        var runRegEx = new RegExp(/^(RUN\s+)/, "ig");

        if (callRegEx.test(lineDetail.parsedLine)) {
            let matches = this.matchAll(lineDetail.parsedLine, callRegEx);
            let matchedValue = Array.from(matches, values => values.reverse().shift()).shift();
            var fileName = matchedValue.trim().replace('@', '').trim();
            return fileName;
        }
        if (includeInsertRegEx.test(lineDetail.parsedLine) && !runRegEx.test(lineDetail.parsedLine) && !phExePhantomRegEx.test(lineDetail.parsedLine)) {
            let matches = this.matchAll(lineDetail.parsedLine, includeInsertRegEx);
            let matchedValue = Array.from(matches, values => values.reverse().shift()).shift();
            var fileName = matchedValue.trim();
            return fileName;
        }
        if (phExePhantomRegEx.test(lineDetail.parsedLine)) {
            let matches = this.matchAll(lineDetail.parsedLine, phExePhantomRegEx);
            let matchedValue = Array.from(matches, values => values.reverse().shift()).shift();
            var fileName = matchedValue.trim();
            return fileName;
        }
        if (!runRegEx.test(lineDetail.parsedLine)) return "";

        var trySplit = lineDetail.parsedLine.split(" ");
        if (trySplit.length <= 2) return "";

        var objectName = trySplit.slice(2).shift().trim();
        return objectName;
    };
    processUniVerseFile = (baseCommands: BaseCommandMaster[], baseCommandRef: BaseCommandReferenceMaster, fileMaster: FileMaster) => new Promise(async (resolve: Function, reject: Function) => {
        try {
            if (!fs.existsSync(fileMaster.FilePath)) resolve();
            const lineBreakElement: string = baseCommandRef.LineBreakElement || "_";
            const fileContent: string = fs.readFileSync(fileMaster.FilePath).toString();
            var fileContentLines: string[] = fileContent.split("\n");
            var lineDetails: Array<LineDetails> = universeArrayExtensions.removeCommentedAndBlankLines(fileContentLines, baseCommandRef.LineComment);
            const contentLines: Array<LineDetails> = universeArrayExtensions.combineAllBrokenLines(lineDetails, lineBreakElement);
            const fileLinesArray: Array<LineDetails> = universeUtilities.processLocateStatements(contentLines);
            let fileLineDetails: Array<LineDetails> = universeUtilities.processCaseStatements(fileLinesArray);
            const lstBaseCommands: BaseCommandMaster[] = [];
            const lstStatementReferenceMaster: Array<StatementReferenceMaster> = [];
            for (const contentLine of fileLineDetails) {
                const baseCommandMaster: BaseCommandMaster = this.extractBaseCommandId(contentLine.parsedLine, baseCommandRef, baseCommands);
                var lineDetail: LineDetails = universeStringExtensions.getCommentAndStatement(contentLine);
                const methodRegExp = new RegExp(baseCommandRef.MethodOrParagraph.Start.join("|"), "ig");
                if (methodRegExp.test(contentLine.parsedLine)) {
                    lineDetail = this.getMethodBusinessName(lineDetail, fileContentLines, baseCommandRef.LineComment);
                }
                if (baseCommandMaster.BaseCommandId === 6) {
                    var callExtObject = this.extractUniVerseFileName(lineDetail);
                    const referenceFileMaster = await floKaptureService.FileMaster.getItem({
                        FileNameWithoutExt: callExtObject
                    });
                    lineDetail.referenceFileId = !referenceFileMaster ? null : referenceFileMaster._id;
                }
                const statementReferenceMaster: StatementReferenceMaster = this
                    .prepareStatementReferenceMaster(lineDetail, baseCommandMaster, fileMaster);
                lstBaseCommands.push(baseCommandMaster);
                lstStatementReferenceMaster.push(statementReferenceMaster);
                await floKaptureService.StatementReferenceMaster.addItem(statementReferenceMaster);
            }
            // Print file statics... This is only for debugging purpose...
            this.printFileStatics(lstBaseCommands, fileMaster);
            let contentWithoutComments: string[] = [];
            fileLineDetails.forEach(c => contentWithoutComments.push(c.parsedLine));
            let fileStatics: FileStatics = {
                exceptions: null,
                lineCount: fileContentLines.length,
                parsed: true,
                processedLineCount: contentWithoutComments.length
            };
            // Update file status...
            await floKaptureService.FileMaster.findByIdAndUpdate(fileMaster._id, {
                Processed: true,
                FileStatics: fileStatics
            });
            resolve({ fileMaster });

            // Insert data into file content master table...
            // This part is now added to separate step...
            /*
            const fileContentMaster: FileContentMaster = {
                FileMaster: fileMaster._id,
                ContentWithoutComments: contentWithoutComments.join("\n"),
                FileContent: fileContent,
                FileId: fileMaster._id
            } as FileContentMaster;
            await floKaptureService.FileContentMaster.addItem(fileContentMaster as FileContentMaster);
            */
        } catch (error) {
            reject({ error });
        } finally { }
    });
    processFileContents = (fileMaster: FileMaster): Promise<any> => new Promise(async (resolve: Function, reject: Function) => {
        {
            try {
                if (!fs.existsSync(fileMaster.FilePath)) resolve();
                const fileContent: string = fs.readFileSync(fileMaster.FilePath).toString();
                let parsedComments = await floKaptureService.StatementReferenceMaster.getModel().find({
                    FileId: fileMaster._id,
                }, "ResolvedStatement").exec();
                let contentWithoutComments: string[] = [];
                parsedComments.forEach((s) => { contentWithoutComments.push(s.ResolvedStatement) });
                const fileContentMaster: FileContentMaster = {
                    FileMaster: fileMaster._id,
                    ContentWithoutComments: contentWithoutComments.join("\n"),
                    FileContent: fileContent,
                    FileId: fileMaster._id
                } as FileContentMaster;
                await floKaptureService.FileContentMaster.addItem(fileContentMaster as FileContentMaster);
                resolve({ fileMaster });
            } catch (error) {
                reject({ error });
            } finally { }
        };
    });
}

const statementReferenceMasterHelper: StatementReferenceMasterHelper = new StatementReferenceMasterHelper();

export { statementReferenceMasterHelper };