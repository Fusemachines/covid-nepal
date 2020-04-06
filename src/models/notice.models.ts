import { Schema, model } from "mongoose";

const NoticeSchema = new Schema({
  title: {
    type: Schema.Types.String
  },
  url: {
    type: Schema.Types.String
  },
  imageUrl: {
    type: Schema.Types.String
  },
  addedAt: {
    type: Schema.Types.Date
  },
  type: {
    type: Schema.Types.String
  },
  tag: {
    type: Schema.Types.String
  }
}, { timestamps: true })

export const NoticeModel = model("Notice", NoticeSchema);