import { Request, Response } from "express";
import Mongoose from "mongoose";
const _: any = require('lodash');
import { floKaptureService } from "../base-repositories/flokapture-db-service";

var createUser = function (request: Request, response: Response) {
    var user = request.body;
    var UserMaster = floKaptureService.UserMaster.getModel();
    var newUser: any = new UserMaster(user);
    newUser
        .save()
        .then(() => {
            return newUser.generateAuthToken();
        }, (err: Mongoose.Error) => {
            response.status(400).send(JSON.stringify(err));
        }).then((token: string) => {
            response.setHeader('x-auth-token', token);
            response.send(newUser.toJSON(newUser));
        }).catch((e: Mongoose.Error) => {
            response.status(400).send(JSON.stringify(e));
        });
};

const userLogin = function (request: Request, response: Response) {
    var body = _.pick(request.body, ['UserName', 'Password']);
    var UserMaster: any = floKaptureService.UserMaster.getModel();
    UserMaster.findByCredentials(body.UserName, body.Password)
        .then(function (user: any) {
            response.setHeader('x-auth-token', user.Tokens[0].token);
            response.status(200).send(UserMaster.toJSON(user));
        })
        .catch(function (ex: Mongoose.Error) {
            response.status(400).send(JSON.stringify(ex));
        });
};

export { createUser, userLogin };