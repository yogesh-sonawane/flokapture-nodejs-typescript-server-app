import Mongoose from "mongoose";
import { projectMasterVirtuals } from "../model-virtuals";
import { ProjectMaster } from "./";

const ProjectDirInfoSchema: Mongoose.Schema<ProjectDirInfo> = new Mongoose.Schema({
    DirId: {
        type: Mongoose.Types.ObjectId, auto: true, required: false
    },
    ProjectId: {
        required: true, type: Mongoose.Types.ObjectId
    },
    RootPath: {
        required: true, type: String
    },
    DirName: {
        required: true, type: String
    },
    DirCompletePath: {
        required: true, type: String
    }
});

ProjectDirInfoSchema.statics.useVirtuals = {
    ProjectMaster: projectMasterVirtuals
};

class ProjectDirInfo extends Mongoose.Document {
    public DirId?: Mongoose.Types.ObjectId;
    public ProjectId: string;
    public RootPath: string;
    public DirName: string;
    public DirCompletePath: string;
    public ProjectMaster: ProjectMaster;
};

export { ProjectDirInfoSchema, ProjectDirInfo };