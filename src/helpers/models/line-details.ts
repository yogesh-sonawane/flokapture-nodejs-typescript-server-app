import Mongoose from "mongoose";

export default class LineDetails {
    lineIndex: number;
    parsedLine: string;
    originalLine: string;
    statementComment?: string;
    businessName?: string;
    referenceFileId?: Mongoose.Types.ObjectId | null | string = ""
};
