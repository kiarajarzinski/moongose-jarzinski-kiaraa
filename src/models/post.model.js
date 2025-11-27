import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
});
    

export const PostModel = model("Post", postSchema);