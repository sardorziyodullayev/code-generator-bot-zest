import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { COLLECTIONS } from '../../common/constant/tables';

@modelOptions({
  schemaOptions: {
    collection: COLLECTIONS.gifts,
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
})
export class Gift {
  _id!: mongoose.Types.ObjectId;

  @prop({ unique: true, type: Number })
  id!: number;

  @prop({ type: String, required: true, trim: true })
  name!: string;

  @prop({ type: String, required: true, trim: true })
  image!: string;

  @prop({ type: Number, default: 0 })
  totalCount!: number;

  @prop({ type: Number, default: 0 })
  usedCount!: number;

  @prop({ type: mongoose.Types.ObjectId, default: null })
  deletedBy!:string | null;

  @prop({ type: String, default: null })
  deletedAt: string;

  updatedAt: string;
  createdAt: string;
}

export const GiftModel = getModelForClass(Gift);
