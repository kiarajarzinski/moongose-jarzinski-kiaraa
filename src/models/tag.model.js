import { model, Schema } from "mongoose";

const TagSchema = new Schema(
  {
    tag_name: {
      type: String,
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// populate para obtener los posts asociados a un tag 
TagSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'tags',
});

// eliminacion logica 
TagSchema.add({ isDeleted: { type: Boolean, default: false } });

export const TagModel = model("Tag", TagSchema);