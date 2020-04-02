import { Schema, model } from "mongoose";

const NewsSchema = new Schema({
  title: {
    type: Schema.Types.String
  },
  url: {
    type: Schema.Types.String
  },
  imageUrl: {
    type: Schema.Types.String
  },
  uploadedAt: {
    type: Schema.Types.Date
  },
  description: {
    type: Schema.Types.String
  },
  type: {
    type: Schema.Types.String
  },
  source: {
    type: Schema.Types.String
  }
}, { timestamps: true })

export const NewsModel = model("news", NewsSchema, "news");