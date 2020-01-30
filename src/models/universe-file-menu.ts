import Mongoose from "mongoose";

const UniVerseFileMenuSchema: Mongoose.Schema<UniVerseFileMenuMaster> = new Mongoose.Schema({
    MenuId: {
        type: String,
        trim: true,
        required: true,
        set: (v: string) => typeof v === "undefined" || v === null ? "" : v
    },
    MenuTitle: {
        type: String,
        trim: true,
        required: true,
        default: null,
        set: (v: string) => typeof v === "undefined" || v === null ? "" : v
    },
    MenuDescription: {
        type: String,
        trim: true,
        required: false,
        default: null,
        set: (v: string) => typeof v === "undefined" || v === null ? "" : v
    },
    ActionExecuted: {
        type: String,
        trim: true,
        required: false,
        default: null,
        set: (v: string) => typeof v === "undefined" || v === null ? "" : v
    },
    UserId: {
        type: Mongoose.Types.ObjectId,
        required: false,
        default: null
    },
    ProjectId: {
        type: Mongoose.Types.ObjectId,
        required: false,
        default: null
    },
    UploadedOn: {
        type: Date,
        default: new Date(),
        get: function (v: Date) {
            return v.toLocaleDateString("en-us");
        }
    }
});

class UniVerseFileMenuMaster extends Mongoose.Document {
    public MenuId: string;
    public MenuTitle: string;
    public MenuDescription: string;
    public ActionExecuted: string;
    public UserId: Mongoose.Types.ObjectId | string;
    public ProjectId: Mongoose.Types.ObjectId | string;
    public UploadedOn: Date | string;
}

export { UniVerseFileMenuSchema, UniVerseFileMenuMaster };