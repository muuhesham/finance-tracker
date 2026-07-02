import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      // required: true,
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel = mongoose.model('User', userSchema);
