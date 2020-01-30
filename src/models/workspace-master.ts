// const globalAny: any = global;
// const dbConnection = globalAny.dbConnection as Mongoose.Connection;

import Mongoose from "mongoose";
import { languageMasterVirtuals } from "../model-virtuals";
import { LanguageMaster } from ".";

const WorkspaceMasterSchema: Mongoose.Schema<WorkspaceMaster> = new Mongoose.Schema({
    WorkspaceId: {
        auto: true,
        type: Mongoose.Schema.Types.ObjectId,
        unique: true
    },
    LanguageId: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true
    },
    WorkspaceName: {
        type: String,
        required: true,
        unique: true
    },
    WorkspaceDescription: {
        required: false,
        type: String
    }
});

WorkspaceMasterSchema.statics.useVirtuals = {
    LanguageMaster: languageMasterVirtuals
};

class WorkspaceMaster extends Mongoose.Document {
    public WorkspaceId: Mongoose.Types.ObjectId | string;
    public LanguageId: Mongoose.Types.ObjectId | string;
    public WorkspaceName: string;
    public WorkspaceDescription: string;
    public LanguageMaster: LanguageMaster;
}

export { WorkspaceMasterSchema, WorkspaceMaster };


/*
WorkspaceMasterSchema.pre(RegExp(/find|findOne/, "ig"), function (next: Function) {
    const wmc: any = this;
    wmc.populate(languageMasterVirtuals.path);
    next();
});
*/

/*
WorkspaceMasterSchema.virtual('LanguageMasters', {
    ref: 'LanguageMaster',
    localField: 'LanguageId',
    foreignField: '_id'
});
*/

/*
const mongooseAutopopulate = require('mongoose-autopopulate');
WorkspaceMasterSchema.plugin(mongooseAutopopulate);

WorkspaceMasterSchema.set('toJSON', {
    virtuals: true,
    getters: true
});

WorkspaceMasterSchema.set('toObject', {
    virtuals: true,
    getters: true
});
*/