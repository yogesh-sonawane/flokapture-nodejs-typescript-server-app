import Mongoose from "mongoose";
import { fileMasterVirtuals } from "../model-virtuals";
import { FileMaster } from ".";

const FileContentMasterSchema: Mongoose.Schema<FileContentMaster> = new Mongoose.Schema({
    FileContentId: {
        auto: true,
        required: false,
        type: Mongoose.Types.ObjectId
    },
    FileId: {
        required: true,
        type: Mongoose.Types.ObjectId
    },
    FileContent: {
        required: true,
        type: String,
        default: "no-contents"
    },
    ContentWithoutComments: {
        required: true,
        type: String,
        default: "no-contents"
    }
});

FileContentMasterSchema.statics.useVirtuals = {
    FileMaster: fileMasterVirtuals
};

class FileContentMaster extends Mongoose.Document {
    public FileContentId: Mongoose.Types.ObjectId | string;
    public FileId: Mongoose.Types.ObjectId | string;
    public FileContent: string;
    public ContentWithoutComments: string;
    public FileMaster: FileMaster;
}

export { FileContentMasterSchema, FileContentMaster };