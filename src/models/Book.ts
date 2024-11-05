import mongoose, { Schema } from 'mongoose';
import { IBookDocument } from '../types/book';

const BookSchema = new Schema<IBookDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  bookCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true
});

export const Book = mongoose.model<IBookDocument>('Book', BookSchema);