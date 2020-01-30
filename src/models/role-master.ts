import Mongoose from "mongoose";

const RoleMasterSchema: Mongoose.Schema<RoleMaster> = new Mongoose.Schema({
    RoleId: {
        required: false,
        type: Mongoose.Types.ObjectId,
        auto: true
    },
    RoleName: {
        required: true,
        type: String
    },
    RoleDescription: {
        required: false,
        default: null,
        type: String
    }
});

class RoleMaster extends Mongoose.Document {
    public RoleId: Mongoose.Types.ObjectId | string;
    public RoleName: string;
    public RoleDescription: string;
}

export { RoleMasterSchema, RoleMaster };
