import { Document, Types } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  year: number;
  bookCode: string;
}

export interface IBookDocument extends IBook, Document {
  _id: Types.ObjectId;
}
