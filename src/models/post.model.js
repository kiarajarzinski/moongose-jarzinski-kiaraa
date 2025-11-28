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
    // relacion uno a muchos muchos posts pertenecen a un author
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // relacion muchos a muchos un post puede tener muchos tags y un tag puede estar en muchos posts
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
});
    

export const PostModel = model("Post", postSchema);