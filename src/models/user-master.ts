import Mongoose from "mongoose";
var Jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcryptJs = require('bcryptjs');
import floKaptureService from "../base-repositories/flokapture-db-service";
import isEmail from "validator/lib/isEmail";

const UserMasterSchema: Mongoose.Schema<UserMaster> = new Mongoose.Schema({
    UserId: {
        type: Mongoose.Types.ObjectId,
        auto: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: function (v: string) {
            return isEmail(v);
        }
    },
    Username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    Password: {
        type: String,
        required: true,
        minlength: 6
    },
    Tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
    }]
}, {
    usePushEach: true
});

UserMasterSchema.methods.toJSON = function () {
    var userMaster = this;
    var userObject = userMaster.toObject();
    return userObject;
};

UserMasterSchema.pre('save', function (next: Function) {
    var userMaster: any = this;
    if (userMaster.isModified('Password')) {
        bcryptJs.genSalt(10, function (err: any, salt: Number) {
            bcryptJs.hash(userMaster.Password, salt, function (e: any, hash: any) {
                userMaster.Password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserMasterSchema.methods.generateAuthToken = function () {
    var userMaster = this;
    var access = 'auth';
    var token = Jwt.sign({
        _id: userMaster._id.toHexString(),
        access: access,
    }, 'floKapture@123').toString();

    userMaster.Tokens.push({
        access: access,
        token: token
    });

    return userMaster.save().then(() => {
        return token;
    });
};

UserMasterSchema.statics.findByCredentials = function (userName: string, password: string) {
    var UserMaster = floKaptureService.UserMaster.getModel();
    return UserMaster.findOne({
        "Username": userName
    }).then((user: any) => {
        if (!user) {
            return Promise.reject('User Not Found');
        }

        return new Promise((resolve, reject) => {
            bcryptJs.compare(password, user.Password, function (err: any, res: any) {
                if (err) reject(err);
                if (res) {
                    resolve(user);
                } else {
                    reject("Incorrect Username or Password");
                }
            });
        });
    });
};

UserMasterSchema.statics.toJSON = function (userMaster: any) {
    var userObject = userMaster.toObject();
    var thisUser = _.pick(userObject, ['_id', 'userName', 'email', 'tokens']);
    return thisUser;
};

class UserMaster extends Mongoose.Document {
    public UserId: Mongoose.Types.ObjectId | string;
    public FirstName: string;
    public LastName: string;
    public Email: string;
    public Username: string;
    public Password: string;
    public Tokens: [{
        access: string;
        token: string;
    }];
    public generateAuthToken: Function;
}

export { UserMasterSchema, UserMaster };