import Mongoose from "mongoose";
import { projectMasterVirtuals } from "../model-virtuals";
import { ProjectMaster } from "./project-master";

const UniVerseDescriptorSchema: Mongoose.Schema<UniVerseDescriptorMaster> = new Mongoose.Schema({
    DescriptorId: {
        type: Mongoose.Types.ObjectId,
        required: false,
        auto: true
    },
    Entity: {
        type: String,
        required: true,
        trim: true
    },
    StoredProcedureName: {
        type: String,
        required: true,
        trim: true
    },
    Type: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    DefaultReportDisplayHeading: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    DefaultFormating: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    DefaultConversion: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    ValuedAssociation: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    LongDescription: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    StatementString: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    ProjectId: {
        type: Mongoose.Types.ObjectId,
        required: true
    }
});

UniVerseDescriptorSchema.statics.useVirtuals = {
    ProjectMaster: projectMasterVirtuals
};

class UniVerseDescriptorMaster extends Mongoose.Document {
    public DescriptorId: Mongoose.Types.ObjectId | string;
    public Entity: string;
    public StoredProcedureName: string;
    public Type: string;
    public DefaultReportDisplayHeading: string;
    public DefaultFormating: string;
    public DefaultConversion: string;
    public ValuedAssociation: string;
    public LongDescription: string;
    public StatementString: string;
    public ProjectId: Mongoose.Types.ObjectId | string;
    public ProjectMaster: ProjectMaster;
}

export { UniVerseDescriptorSchema, UniVerseDescriptorMaster };