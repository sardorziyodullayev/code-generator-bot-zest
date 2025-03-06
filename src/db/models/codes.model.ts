import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { COLLECTIONS } from '../../common/constant/tables';

@modelOptions({
  schemaOptions: {
    collection: COLLECTIONS.codes,
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
})
@index({ value: 1 }, { unique: true })
export class Code {
  _id!: mongoose.Types.ObjectId;

  @prop({ unique: true, type: Number })
  id!: number;

  @prop({ type: String })
  value!: string;

  @prop({ type: Number })
  version!: number;

  @prop({ type: mongoose.Types.ObjectId, default: null })
  giftId!: mongoose.Types.ObjectId | null;

  @prop({ type: mongoose.Types.ObjectId, required: true })
  productId!: mongoose.Types.ObjectId | null;

  @prop({ type: Boolean, default: false })
  isUsed!: boolean;

  @prop({ default: null })
  usedById!: mongoose.Types.ObjectId;

  @prop({ type: String, default: '' })
  usedAt!: string;

  @prop({ type: mongoose.Types.ObjectId, default: null })
  deletedBy!: string | null;

  @prop({ type: String, default: null })
  deletedAt: string;

  updatedAt: string;
  createdAt: string;
}

export const CodeModel = getModelForClass(Code);
