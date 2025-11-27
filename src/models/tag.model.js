import { model, Schema } from "mongoose";

const TagSchema = new Schema(
  {
    tag_name: {
      type: String,
      required: true,
    },
  },
);

export const TagModel = model("Tag", TagSchema);