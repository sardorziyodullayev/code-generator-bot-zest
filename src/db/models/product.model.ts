import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { COLLECTIONS } from '../../common/constant/tables';

@modelOptions({
  schemaOptions: {
    collection: COLLECTIONS.products,
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
})
export class Product {
  _id!: mongoose.Types.ObjectId;

  @prop({ unique: true, type: Number })
  id!: number;

  @prop({ type: String, required: true, trim: true })
  name!: string;

  @prop({ type: String, default: null, trim: true })
  image!: string | null;

  @prop({ type: mongoose.Types.ObjectId, default: null })
  deletedBy!: string | null;

  @prop({ type: String, default: null })
  deletedAt: string;

  updatedAt: string;
  createdAt: string;
}

export const ProductModel = getModelForClass(Product);
