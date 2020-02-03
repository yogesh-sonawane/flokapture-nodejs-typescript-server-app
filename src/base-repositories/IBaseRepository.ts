import { Document, Model, DocumentQuery } from "mongoose";
import { Collection, ObjectId, } from "mongodb";
import { PartialObject } from "lodash";

export default interface IBaseRepository<TSource extends Document> {
    getModel(): Model<TSource>;
    mongoDbCollection(): Collection<TSource>;
    addItem(item: TSource): Promise<TSource>;
    getItem(filter: Object): Promise<TSource>;
    getDocuments(filter: Object): Promise<Array<TSource>>;
    getAllDocuments(): Promise<Array<TSource>>;
    findById(id: string | ObjectId): Promise<TSource>;
    findByIdAndUpdate(id: string | ObjectId, fieldsToUpdate: PartialObject<TSource>): Promise<TSource>;
    bulkInsert(items: Array<TSource> | TSource): Promise<Array<TSource>>;
    remove(id: string | ObjectId): DocumentQuery<TSource, TSource, {}>;
}