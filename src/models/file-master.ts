import Mongoose from "mongoose";
import { fileTypeMasterVirtuals, projectMasterVirtuals } from "../model-virtuals";
import { FileTypeMaster, ProjectMaster } from ".";
const ObjectId = Mongoose.Types.ObjectId;

class FileStatics {
    lineCount: number = 0;
    processedLineCount: number = 0;
    parsed: boolean = false;
    exceptions: any = null;
};

const FileMasterSchema: Mongoose.Schema<FileMaster> = new Mongoose.Schema({
    FileId: {
        auto: true,
        type: ObjectId,
        unique: true
    },
    ProjectId: {
        type: ObjectId,
        required: true
    },
    FileTypeMasterId: {
        type: ObjectId,
        required: true
    },
    FileName: {
        type: String,
        trim: true,
        required: true
    },
    FileNameWithoutExt: {
        type: String,
        trim: true,
        required: true
    },
    FilePath: {
        type: String,
        required: true,
        trim: true
    },
    Processed: {
        type: Boolean,
        default: false,
        required: false
    },
    LinesCount: {
        type: Number,
        default: 0,
        required: false
    },
    WorkFlowStatus: {
        type: String,
        required: false,
        default: null
    },
    FileStatics: {
        type: FileStatics,
        default: null        
    }
});

FileMasterSchema.statics.useVirtuals = {
    FileTypeMaster: fileTypeMasterVirtuals,
    ProjectMaster: projectMasterVirtuals
};

class FileMaster extends Mongoose.Document {
    public FileId: Mongoose.Types.ObjectId | string;
    public ProjectId: Mongoose.Types.ObjectId | string;
    public FileTypeMasterId: Mongoose.Types.ObjectId | string;
    public FileName: string;
    public FileNameWithoutExt: string;
    public FilePath: string;
    public Processed: boolean;
    public LinesCount: number;
    public WorkFlowStatus: string;
    public FileTypeMaster: FileTypeMaster;
    public ProjectMaster: ProjectMaster;
    public FileStatics: FileStatics;
}

export { FileMasterSchema, FileMaster };