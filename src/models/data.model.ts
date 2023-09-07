import { TDataModel } from "@/types/types";
import mongoose, { Schema, Document } from "mongoose";

const ObjectId = Schema.ObjectId;

const DocSchema: Schema = new Schema({}, { strict: false });
DocSchema.set('toObject', { virtuals: true });
DocSchema.set('toJSON', { virtuals: true });

const DataSchema: Schema = new Schema({
    projectId: {
        type: ObjectId,
        require: true
    },
    structureId: {
        type: ObjectId,
        require: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy: {
        type: ObjectId,
        required: true
    },
    updatedBy: {
        type: ObjectId,
        required: true
    },
    doc: DocSchema
});

DataSchema.set('toObject', { virtuals: true });
DataSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Data || mongoose.model < TDataModel & Document > ("Data", DataSchema);