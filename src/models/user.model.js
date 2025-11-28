import { model, Schema } from "mongoose";
import { ProfileSchema } from "./profile.model.js";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // relacion embebida 1 a 1 
    profile: {
      type: ProfileSchema,
      required: false,
    },
    // eliminacion logica 
    isDeleted: { type: Boolean,
    default: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// uso del populate para obtener los posts de un user 
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

export const UserModel = model("User", UserSchema);