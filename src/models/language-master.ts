import Mongoose from "mongoose";
// import TSource from "./t-source-base";

var LanguageMasterSchema: Mongoose.Schema<LanguageMaster> = new Mongoose.Schema({
    LanguageId: {
        auto: true,
        type: Mongoose.Types.ObjectId,
        unique: true
    },
    LanguageName: {
        required: true,
        type: String,
        unique: true
    },
    LanguageDescription: {
        required: false,
        type: String
    },
    CreatedOn: {
        type: Date
    }
});

class LanguageMaster extends Mongoose.Document {
    public LanguageId: Mongoose.Types.ObjectId | string;
    public LanguageName: string;
    public LanguageDescription: string;
}

export { LanguageMasterSchema, LanguageMaster };