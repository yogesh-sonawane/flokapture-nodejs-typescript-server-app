import { languageMasterVirtuals, workspaceMasterVirtuals } from "../model-virtuals";
import Mongoose from "mongoose";
import { LanguageMaster, WorkspaceMaster } from ".";

enum ProcessingStatus {
    NotProcessed = 0,
    Processing = 2,
    Error = 3,
    Processed = 1
};

const ProjectMasterSchema: Mongoose.Schema<ProjectMaster> = new Mongoose.Schema({
    ProjectId: {
        auto: true,
        unique: true,
        type: Mongoose.Types.ObjectId
    },
    ProjectName: {
        type: String,
        required: true,
        unique: true
    },
    ProjectDescription: {
        type: String,
        required: false
    },
    WorkspaceId: {
        type: Mongoose.Types.ObjectId,
        required: true
    },
    LanguageId: {
        type: Mongoose.Types.ObjectId,
        required: false
    },
    UploadedPath: {
        type: String,
        default: ""
    },
    ExtractedPath: {
        type: String,
        default: ""
    },
    IsActive: {
        type: Boolean,
        default: true
    },
    IsCtCode: {
        type: Boolean,
        default: false
    },
    UploadDetails: {
        FileName: {
            type: String
        },
        UploadPath: {
            type: String
        },
        CompletePath: {
            type: String
        }
    },
    UploadedOn: {
        type: Date,
        required: false,
        default: new Date(),
        get: function (v: Date) {
            return v.toLocaleDateString("en-us");
        }
    },
    ProcessedOn: {
        type: Date,
        required: false,
        default: null,
        get: function (v: Date) {
            if (typeof v === "undefined" || v === null) return null;
            return v.toLocaleDateString("en-us");
        }
    },
    TotalObjects: {
        type: Number,
        required: false,
        default: 0
    },
    Status: {
        type: Boolean,
        default: true,
        required: false,
        get: function (v: Boolean) {
            return v ? "Yes" : "No";
        }
    },
    ProcessingStatus: {
        type: ProcessingStatus,
        required: false,
        default: ProcessingStatus.NotProcessed
    }
});

ProjectMasterSchema.statics.useVirtuals = {
    LanguageMaster: languageMasterVirtuals,
    WorkspaceMaster: workspaceMasterVirtuals
};

class ProjectMaster extends Mongoose.Document {
    public ProjectId: Mongoose.Types.ObjectId | string;
    public ProjectName: string;
    public ProjectDescription: string;
    public WorkspaceId: Mongoose.Types.ObjectId | string;
    public LanguageId: Mongoose.Types.ObjectId | string;
    public UploadedPath: string;
    public ExtractedPath: string;
    public IsActive: boolean;
    public IsCtCode: boolean;
    public UploadDetails: {
        FileName: string;
        UploadPath: string;
        CompletePath: string;
    };
    public UploadedOn: Date;
    public ProcessedOn: Date;
    public TotalObjects: number;
    public Status: boolean;
    public ProcessingStatus: ProcessingStatus;
    public LanguageMaster: LanguageMaster;
    public WorkspaceMaster: WorkspaceMaster;
}

export { ProjectMasterSchema, ProjectMaster };