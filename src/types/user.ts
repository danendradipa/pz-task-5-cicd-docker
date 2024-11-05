import { Document, Types } from 'mongoose';

export interface IUser {
  username: string; // Nama pengguna
  password: string; // Kata sandi
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId; // ID pengguna yang dibuat otomatis oleh MongoDB
}