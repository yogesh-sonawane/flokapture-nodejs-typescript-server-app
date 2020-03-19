import Mongoose from "mongoose";

export default class TSource extends Mongoose.Document {
    public CreatedOn: Date;
    public CreatedBy: Mongoose.Types.ObjectId;
}