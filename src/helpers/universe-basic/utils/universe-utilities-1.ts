var UnZipper = require("unzipper");
import fs from "fs";
import path from "path";

class UniVerseUtilities {
    static extractProjectZip = function (projectMaster: any) {
        return new Promise((resolve, reject) => {
            var extractPath = path.join(__dirname, "../", "../", "ExtractedProjects");
            if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath);
            fs.createReadStream(projectMaster.UploadDetails.CompletePath)
                .pipe(UnZipper.Extract({
                    path: extractPath
                }))
                .on("error", (err: any) => {
                    reject({
                        message: "Error occured while extracting .zip",
                        project: JSON.stringify(projectMaster),
                        error: JSON.stringify(err)
                    });
                }).on("end", () => {
                    resolve(extractPath);
                });
            resolve(extractPath);
        });
    };

    static vaidateDirStructure = function (rootPath: string) {
        const dirNames = ["Programs", "Jcl", "Include", "Menu", "I-Descriptors", "DataDictionary"];
        if (!fs.existsSync(rootPath)) return false;

        var allDirectories = fs.readdirSync(rootPath);
        var exist = false;
        for (const dir of allDirectories) {
            exist = dirNames.includes(dir);
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
            console.log(newPath);
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

    public waitForMoment = (milliseconds: number): Promise<unknown> => new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
const universeUtilities: UniVerseUtilities = new UniVerseUtilities();
export { universeUtilities, UniVerseUtilities };