import Mongoose from "mongoose";
import { fileMasterVirtuals, baseCommandMasterVirtuals } from "../model-virtuals";
import { FileMaster, BaseCommandMaster } from "./";

const StatementReferenceMasterSchema: Mongoose.Schema<StatementReferenceMaster> = new Mongoose.Schema({
    StatementId: {
        auto: true,
        required: false,
        type: Mongoose.Types.ObjectId
    },
    FileId: {
        required: true,
        type: Mongoose.Types.ObjectId
    },
    ReferenceFileId: {
        required: false,
        default: null,
        type: Mongoose.Types.ObjectId
    },
    BaseCommandId: {
        required: false,
        default: null,
        type: Mongoose.Types.ObjectId
    },
    OriginalStatement: {
        required: false,
        type: String
    },
    ResolvedStatement: {
        required: false,
        type: String
    },
    MethodName: {
        required: false,
        type: String,
        trim: true
    },
    BusinessName: {
        required: false,
        type: String,
        trim: true
    },
    AlternateName: {
        required: false,
        type: String,
        trim: true
    },
    StatementComment: {
        required: false,
        type: String,
        trim: true
    }
});

StatementReferenceMasterSchema.statics.useVirtuals = {
    FileMaster: fileMasterVirtuals,
    ReferenceFileMaster: fileMasterVirtuals,
    BaseCommandMaster: baseCommandMasterVirtuals,
};

class StatementReferenceMaster extends Mongoose.Document {
    public StatementId: Mongoose.Types.ObjectId | string;
    public FileId: Mongoose.Types.ObjectId | string;
    public ReferenceFileId: Mongoose.Types.ObjectId | string | null;
    public BaseCommandId: Mongoose.Types.ObjectId | string | null;
    public OriginalStatement: string;
    public ResolvedStatement: string;
    public MethodName: string | null | "";
    public BusinessName: string | null | "";
    public AlternateName: string | null | "";
    public StatementComment: string | null | "";
    public FileMaster: FileMaster | null;
    public ReferenceFileMaster: FileMaster | null;
    public BaseCommandMaster: BaseCommandMaster | null;
}

export { StatementReferenceMasterSchema, StatementReferenceMaster };