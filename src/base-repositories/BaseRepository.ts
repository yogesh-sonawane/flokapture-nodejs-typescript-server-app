const globalAny: any = global;
const mongooseLeanVirtuals: any = require('mongoose-lean-virtuals');
const mongooseLeanGetters: any = require('mongoose-lean-getters');
const mongooseLeanDefaults: any = require('mongoose-lean-defaults');
const mongooseAutopopulate: any = require('mongoose-autopopulate');
import IBaseRepository from "./IBaseRepository";
import Mongoose, { DocumentQuery } from "mongoose";
import { Db, Collection, ObjectId } from "mongodb";
import { PartialObject } from "lodash";
// import { TSource } from "../models";
const dbConnection: Mongoose.Connection = globalAny.dbConnection as Mongoose.Connection;
const mongoDbConnection: Db = globalAny.mongoDbConnection as Db;
// const mongoClient: MongoClient = globalAny.mongoDbClient as MongoClient;

export default class BaseRepository<TSource extends Mongoose.Document> implements IBaseRepository<TSource> {
    public schemaDefaults: Object = { autopopulate: true, versionKey: false, virtuals: true, getters: true, defaults: true, flattenMap: false };
    public mongooseModel: Mongoose.Model<TSource, {}>;
    public mongoDbModel: Collection<TSource>;
    public mongooseConnection: Mongoose.Connection = dbConnection;
    public mongooseQuery: Mongoose.Query<TSource>;
    constructor({ collectionName, schema }: { collectionName: string; schema: Mongoose.Schema<TSource>; }) {
        schema.set("versionKey", false);
        this.checkVirtuals(schema);
        schema.plugin(mongooseAutopopulate);
        schema.plugin(mongooseLeanVirtuals);
        schema.plugin(mongooseLeanGetters);
        schema.plugin(mongooseLeanDefaults);
        schema.set('toJSON', this.schemaDefaults);
        schema.set('toObject', this.schemaDefaults);
        this.mongoDbModel = mongoDbConnection.collection<TSource>(collectionName);
        this.mongooseModel = dbConnection.model<TSource>(collectionName, schema, collectionName);
        this.mongooseQuery = new Mongoose.Query<TSource>();
    }

    private checkVirtuals = function (schema: Mongoose.Schema<TSource>)  {
        if (!schema.statics.hasOwnProperty("useVirtuals")) return;
        for (const key in schema.statics.useVirtuals) {
            const value: object = schema.statics.useVirtuals[key].value;
            schema.virtual(key, value);
            // const fields: string[] = schema.statics.useVirtuals[key].fields || [];
            // schema.path(key, { ref: key, autopopulate: { select: fields, maxDepth: 3 }, type: Mongoose.Types.ObjectId });
            schema.pre<Mongoose.Aggregate<TSource>>("aggregate", function (next: Function) {
                const pipeLine: { from: string, localField: string, foreignField: string, as: string } = (({ from, localField, foreignField, as }) => ({ from, localField, foreignField, as }))(schema.statics.useVirtuals[key].value);
                const unWind: boolean = schema.statics.useVirtuals[key].unWind || false;
                // unWind ? this.lookup(pipeLine).unwind(key) : this.lookup(pipeLine);
                if (unWind) {
                    this.lookup(pipeLine).unwind(key);
                } else {
                    this.lookup(pipeLine);
                }
                next();
            });
        }
    };

    remove(id: string | ObjectId): DocumentQuery<TSource, TSource, {}> {
        try {
            var _id = id instanceof ObjectId ? id : Mongoose.Types.ObjectId(id);
            return this.mongooseModel.findByIdAndRemove(_id);
        } catch (err) {
            console.log(err)
            throw new Error(JSON.stringify(err));
        }
    }

    mongoDbCollection(): Collection<TSource> {
        return this.mongoDbModel;
    }

    getModel(): Mongoose.Model<TSource> {
        return this.mongooseModel;
    }

    async updateDocuments(conditions: PartialObject<TSource>, fieldsToUpdate: PartialObject<TSource>): Promise<Array<TSource>> {
        return await this.mongooseModel.updateMany(conditions, fieldsToUpdate);
    }
    async addItem(item: TSource): Promise<TSource> {
        try {
            return (await this.mongooseModel.create(item)).toObject();
        } catch (err) {
            console.log(err)
            throw new Error(JSON.stringify(err));
        }
    }

    async updateOrInsert(item: TSource): Promise<TSource> {
        try {
            item._id = !item._id || typeof item._id === "undefined" ? new Mongoose.Types.ObjectId() : item._id;
            return await this.mongooseModel.updateOne({ _id: item._id }, { $set: item }, { upsert: true, multi: true });
        } catch (err) {
            console.log(err);
            throw new Error(JSON.stringify(err));
        }
    };

    async getAllDocuments(limit?: number, skip?: number): Promise<Array<TSource>> {
        try {
            return await this.mongooseModel.find().skip(skip).limit(limit).lean(this.schemaDefaults);
            // return (await this.mongooseModel.find({}).skip(skip).limit(limit)).map(docs => docs.toJSON());  //.lean(this.leanDefaults);
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify(error));
        }
    }

    async getItem(filter: Object): Promise<TSource> {
        return await this.mongooseModel.findOne(filter).lean(this.schemaDefaults);
        // return (await this.mongooseModel.findOne(filter)).toObject();
    }

    async getDocuments(filter: PartialObject<TSource>, projection?: Object | string | null, options?: Object): Promise<TSource[]> {
        return await this.mongooseModel.find(filter, projection, options).lean(this.schemaDefaults);
    }

    async findById(id: string | ObjectId): Promise<TSource> {
        var _id = id instanceof ObjectId ? id : Mongoose.Types.ObjectId(id);
        return await this.mongooseModel.findById(_id).lean(this.schemaDefaults);
    }

    async bulkInsert(items: Array<TSource> | TSource): Promise<Array<TSource>> {
        if (!Array.isArray(items)) items = [items];
        return (await this.mongooseModel.insertMany(items)).map((docs: TSource): TSource => docs.toObject());
    }

    async findByIdAndUpdate(id: string | ObjectId, fieldsToUpdate: PartialObject<TSource>): Promise<TSource> {
        var _id: ObjectId = id instanceof ObjectId ? id : Mongoose.Types.ObjectId(id);
        return await this.mongooseModel.findByIdAndUpdate(_id, fieldsToUpdate, {
            new: true,
            runValidators: true
        }).lean(this.schemaDefaults);
    }

    async aggregate(aggregatePipeline?: Array<Object>): Promise<Array<TSource>> {
        return await this.mongooseModel.aggregate(aggregatePipeline).limit(5).exec();
    }
}