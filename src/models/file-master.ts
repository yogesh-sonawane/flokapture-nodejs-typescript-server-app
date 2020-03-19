import Mongoose from "mongoose";
import { fileTypeMasterVirtuals, projectMasterVirtuals } from "../model-virtuals";
import { FileTypeMaster, ProjectMaster } from ".";
const ObjectId = Mongoose.Types.ObjectId;

/*
function FileStatistics(key: any, options: object) {
    this.lineCount = 0;
    this.processedLineCount = 0;
    this.parsed = false;
    this.exceptions = null;
    Mongoose.SchemaType.call(this, key, options, "FileStatistics");
};
FileStatistics.prototype = Object.create(Mongoose.SchemaType.prototype);
FileStatistics.prototype.cast = function (val: object) {
    var _val = typeof val === "object";
    return _val ? val : null;
};
Mongoose.Schema.Types.FileStatistics = FileStatistics;
*/
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
        // type: FileStatistics
        type: {
            lineCount: Number,
            processedLineCount: Number,
            parsed: Boolean,
            exceptions: Mongoose.Schema.Types.Mixed
        },
        default: null
    }
});

FileMasterSchema.statics.useVirtuals = {
    FileTypeMaster: fileTypeMasterVirtuals,
    ProjectMaster: projectMasterVirtuals
};

const ReferenceFileMasterSchema: Mongoose.Schema<ReferenceFileMaster> = new Mongoose.Schema({
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
        // type: FileStatistics
        type: {
            lineCount: Number,
            processedLineCount: Number,
            parsed: Boolean,
            exceptions: Mongoose.Schema.Types.Mixed
        },
        default: null
    }
});

ReferenceFileMasterSchema.statics.useVirtuals = {
    FileTypeMaster: fileTypeMasterVirtuals,
    ProjectMaster: projectMasterVirtuals
};

class FileStatics {
    public lineCount: number = 0;
    public processedLineCount: number = 0;
    public parsed: boolean = false;
    public exceptions: any = null;
}
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

class ReferenceFileMaster extends Mongoose.Document {
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

export { FileMasterSchema, ReferenceFileMasterSchema, FileMaster, ReferenceFileMaster };