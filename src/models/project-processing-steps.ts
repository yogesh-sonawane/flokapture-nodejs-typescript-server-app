import Mongoose from "mongoose";
var moment: any = require("moment");

const ProcessingStepSchema: Mongoose.Schema<ProjectProcessingStep> = new Mongoose.Schema({
    ProcessingStepId: {
        auto: true,
        type: Mongoose.Types.ObjectId
    },
    ProjectId: {
        type: Mongoose.Types.ObjectId,
        required: true
    },
    StepName: {
        type: String,
        required: true,
        default: ""
    },
    StepDescription: {
        type: String,
        required: true,
        default: ""
    },
    StartedOn: {
        type: Date,
        required: false,
        default: null,
        get: function (v: Date) {
            if (typeof v === "undefined" || v === null) return null;
            var mom = moment(v).format("MM/DD/YYYY hh:mm:ss A");
            return mom;
        }
    },
    CompletedOn: {
        type: Date,
        required: false,
        default: null,
        get: function (v: Date) {
            if (typeof v === "undefined" || v === null) return null;
            var mom = moment(v).format("MM/DD/YYYY hh:mm:ss A");
            return mom;
        }
    },
    CanReprocess: {
        type: Boolean,
        default: false
    },
    ReProcessDetails: {
        TableName: {
            type: String,
            required: false,
            default: ""
        }
    }
});

class ProjectProcessingStep extends Mongoose.Document {
    public ProcessingStepId: Mongoose.Types.ObjectId | string;
    public ProjectId: Mongoose.Types.ObjectId | string;
    public StepName: string;
    public StepDescription: string;
    public StartedOn: Date;
    public CompletedOn: Date;
    public CanReprocess: boolean;
    public ReProcessDetails: {
        TableNaName: string | null | '';
    }
};

export { ProcessingStepSchema, ProjectProcessingStep };