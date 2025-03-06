import { getModelForClass, index, modelOptions, mongoose, prop, types } from '@typegoose/typegoose';
import { COLLECTIONS } from '../../common/constant/tables';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: COLLECTIONS.codeLogs,
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  },
})
export class CodeLog {
  @prop({ _id: true })
  _id!: mongoose.Types.ObjectId;

  @prop({ required: true })
  value: string;

  @prop({ default: null })
  codeId!: Types.ObjectId;

  @prop({ required: true })
  userId!: Types.ObjectId;

  updatedAt: string;
  createdAt: string;

  @prop({ type: mongoose.Types.ObjectId, default: null })
  deletedBy!: string | null;

  @prop({ type: String, default: null })
  deletedAt: string;
}

export const CodeLogModel = getModelForClass(CodeLog);
