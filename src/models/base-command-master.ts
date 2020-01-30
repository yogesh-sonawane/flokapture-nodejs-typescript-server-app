import Mongoose from "mongoose";

const BaseCommandMasterSchema: Mongoose.Schema<BaseCommandMaster> = new Mongoose.Schema({
    BaseCommandId: {
        type: Number,
        required: true
    },
    BaseCommand: {
        type: String,
        required: true,
        trim: true
    }
});


class BaseCommandMaster extends Mongoose.Document {
    public BaseCommandId: number;
    public BaseCommand: string;
}

export { BaseCommandMasterSchema, BaseCommandMaster };