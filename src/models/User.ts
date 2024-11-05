// models/User.ts

import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../types/user';

const UserSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: true, 
    unique: true, 
    trim: true, 
  },
  password: {
    type: String,
    required: true, 
  },
}, {
  timestamps: true, // Menambahkan createdAt dan updatedAt secara otomatis
});

// Mengexport model User
export const User = mongoose.model<IUserDocument>('User', UserSchema);
