import Mongoose from "mongoose";
import { languageMasterVirtuals } from "../model-virtuals";
import { LanguageMaster } from "./language-master";

const FileTypeMasterSchema: Mongoose.Schema<FileTypeMaster> = new Mongoose.Schema({
    FileTypeMasterId: {
        type: Mongoose.Types.ObjectId,
        auto: true
    },
    FileTypeName: {
        type: String,
        required: true,
        trim: true
    },
    FileTypeExtension: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    Delimiter: {
        type: String,
        required: false,
        trim: true
    },
    Color: {
        type: String,
        required: true
    },
    FolderNames: {
        type: [String],
        required: true,
        set: (fn: string[]) => [...new Set(fn.map(f => f.toLowerCase()))] // distinct with lowerCase
    },
    LanguageId: {
        required: true,
        type: Mongoose.Types.ObjectId
    }
});

FileTypeMasterSchema.statics.useVirtuals = {
    LanguageMaster: languageMasterVirtuals
};

class FileTypeMaster extends Mongoose.Document {
    public FileTypeMasterId: Mongoose.Types.ObjectId | string;
    public FileTypeName: string;
    public FileTypeExtension: string;
    public Delimiter: string;
    public Color: string;
    public FolderNames: [string];
    public LanguageId: Mongoose.Types.ObjectId | string;
    public LanguageMaster: LanguageMaster;
}

export { FileTypeMasterSchema, FileTypeMaster };