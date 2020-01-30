import { LineDetails } from "../../models";

class UniverseStringExtensions extends String {
    checkStatement = (statement: string): boolean =>
        (typeof statement === "undefined" || statement === "" || statement === null || /\\s+/.test(statement));
    hasCommentsInStatement = (statement: string): boolean => {
        const valid = /(?:[\;\*][\;\s\*]+)/.test(statement);
        if (valid && !statement.includes(";")) return false;
        return valid;
    };
    getCommentAndStatement = (lineDetail: LineDetails): LineDetails => {
        const hasComment = this.hasCommentsInStatement(lineDetail.parsedLine);
        if (!hasComment) return lineDetail;
        const commentIndex = lineDetail.parsedLine.lastIndexOf(';');
        const swc = lineDetail.parsedLine.substring(0, commentIndex).trim();
        const sc = lineDetail.parsedLine.substring(commentIndex).trim().replace("; *", "").replace(";*", "").trim();
        lineDetail.parsedLine = swc;
        lineDetail.statementComment = sc;
        return lineDetail;
    };
    fileNameWithoutExtension = function (path: string): string {
        var fileName = path.split('.').slice(0, -1).join('.');
        return fileName;
    };
    fileExtensionOnly = function (path: string): string {
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
}

const universeStringExtensions: UniverseStringExtensions = new UniverseStringExtensions();

export { universeStringExtensions, UniverseStringExtensions };