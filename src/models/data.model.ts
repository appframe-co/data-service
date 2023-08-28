import mongoose, { Schema, Document } from "mongoose";

const ObjectId = Schema.ObjectId;

const DataSchema: Schema = new Schema({}, { strict: false });

DataSchema.set('toObject', { virtuals: true });
DataSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Data || mongoose.model < any & Document > ("Data", DataSchema);