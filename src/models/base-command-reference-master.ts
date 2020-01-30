import Mongoose from "mongoose";
import { languageMasterVirtuals, fileTypeMasterVirtuals } from "../model-virtuals";
import { LanguageMaster, FileTypeMaster } from "./";

var BaseCommandRefSchema: Mongoose.Schema<BaseCommandReferenceMaster> = new Mongoose.Schema({
    LanguageId: {
        type: Mongoose.Types.ObjectId,
        required: true
    },
    FileTypeMasterId: {
        type: Mongoose.Types.ObjectId,
        required: true
    },
    ClassStart: {
        required: false,
        type: String,
        default: ""
    },
    ClassEnd: {
        required: false,
        type: String,
        default: ""
    },
    IfStart: {
        type: [String],
        required: true
    },
    ElseBlock: {
        type: String,
        required: true,
        default: "ELSE"
    },
    IfEnd: {
        required: true,
        type: [String]
    },
    CallInternal: {
        required: true,
        type: [String]
    },
    CallExternal: {
        required: true,
        type: [String]
    },
    Loop: {
        Start: {
            required: true,
            type: [String]
        },
        End: {
            required: true,
            type: [String]
        }
    },
    MethodOrParagraph: {
        Start: {
            required: true,
            type: [String]
        },
        End: {
            required: true,
            type: String
        }
    },
    BlockComment: {
        Start: {
            type: String,
            required: true,
            trim: true,
            default: "/*"
        },
        End: {
            type: String,
            required: true,
            trim: true,
            default: "*/"
        }
    },
    LineComment: {
        type: String,
        required: true,
        trim: true,
        default: "*"
    },
    CommentWithinLine: {
        type: String,
        required: true,
        trim: true,
        default: "; *"
    }
});

BaseCommandRefSchema.statics.useVirtuals = {
    LanguageMaster: languageMasterVirtuals,
    FileTypeMaster: fileTypeMasterVirtuals
}

class BaseCommandReferenceMaster extends Mongoose.Document {
    public LanguageId: Mongoose.Types.ObjectId | string;
    public FileTypeMasterId: Mongoose.Types.ObjectId | string;
    public ClassStart: string;
    public ClassEnd: string;
    public IfStart: [string];
    public IfEnd: [string];
    public ElseBlock: string;
    public CallInternal: [string];
    public CallExternal: [string];
    public Loop: {
        Start: [string],
        End: [string]
    };
    public MethodOrParagraph: {
        Start: [string],
        End: [string]
    };
    public BlockComment: {
        Start: string,
        End: string
    };
    public LineComment: string;
    public CommentWithinLine: string;
    public LineBreakElement: string = "_";
    public LanguageMaster: LanguageMaster;
    public FileTypeMaster: FileTypeMaster;
}

export { BaseCommandRefSchema, BaseCommandReferenceMaster };