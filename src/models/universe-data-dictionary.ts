import Mongoose from "mongoose";
import { projectMasterVirtuals } from "../model-virtuals";
import { ProjectMaster } from "./";

const UniVerseDataDictionarySchema: Mongoose.Schema<UniVerseDataDictionary> = new Mongoose.Schema({
    RowId: {
        auto: true,
        type: Mongoose.Types.ObjectId,
        index: true
    },
    FileName: {
        required: true,
        type: String
    },
    FieldNo: {
        required: true,
        type: String
    },
    Description: {
        type: String,
        default: "",
        get: (v: string | null) => {
            return typeof v === "undefined" ? "" : v
        },
        set: (v: string | null) => typeof v === "undefined" ? "" : v
    },
    FieldLabel: {
        type: String,
        default: "",
        get: (v: string | null) => {
            return typeof v === "undefined" ? "" : v
        },
        set: (v: string | null) => typeof v === "undefined" ? "" : v
    },
    RptFieldLength: {
        type: String,
        default: "",
        get: (v: string | null) => {
            return typeof v === "undefined" ? "" : v
        },
        set: (v: string | null) => typeof v === "undefined" ? "" : v
    },
    TypeOfData: {
        type: String,
        default: "",
        get: (v: string | null) => {
            return typeof v === "undefined" ? "" : v
        },
        set: (v: string | null) => typeof v === "undefined" ? "" : v
    },
    SingleArray: {
        type: String,
        default: "",
        get: (v: string | null) => {
            return typeof v === "undefined" ? "" : v
        },
        set: (v: string | null) => typeof v === "undefined" ? "" : v
    },
    DateOfCapture: {
        type: String,
        default: "",
        get: (v: string | null) => {
            return typeof v === "undefined" ? "" : v
        },
        set: (v: string | null) => typeof v === "undefined" ? "" : v
    },
    ReplacementName: {
        required: true,
        type: String
    },
    ProjectId: {
        required: true,
        type: Mongoose.Types.ObjectId
    }
});

UniVerseDataDictionarySchema.statics.useVirtuals = {
    ProjectMaster: projectMasterVirtuals
};

class UniVerseDataDictionary extends Mongoose.Document {
    public RowId: Mongoose.Types.ObjectId | string;
    public FileName: string;
    public FieldNo: string;
    public Description: string;
    public FieldLabel: string;
    public RptFieldLength: string;
    public TypeOfData: string;
    public SingleArray: string;
    public DateOfCapture: string;
    public ReplacementName: string;
    public ProjectId: Mongoose.Types.ObjectId | string;
    public ProjectMaster: ProjectMaster | null;
}

export { UniVerseDataDictionarySchema, UniVerseDataDictionary };