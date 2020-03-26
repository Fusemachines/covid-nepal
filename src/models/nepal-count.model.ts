import { Schema, model } from "mongoose";

const NepalCountSchema = new Schema({
  testedToday: {
    type: Schema.Types.Number
  },
  confirmedToday: {
    type: Schema.Types.Number
  },
  recoveredToday: {
    type: Schema.Types.Number
  },
  deathToday: {
    type: Schema.Types.Number
  },
  testedTotal: {
    type: Schema.Types.Number
  },
  confirmedTotal: {
    type: Schema.Types.Number
  },
  recoveredTotal: {
    type: Schema.Types.Number
  },
  deathTotal: {
    type: Schema.Types.Number
  }
}, { timestamps: true })

export const NepalCountModel = model("nepalCount", NepalCountSchema, "nepalCounts");