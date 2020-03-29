import { Schema, model } from "mongoose";

const GlobalCountSchema = new Schema({
  confirmedToday: {
    type: Schema.Types.Number
  },
  recoveredToday: {
    type: Schema.Types.Number
  },
  deathToday: {
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

export const GlobalCountModel = model("globalCount", GlobalCountSchema, "globalCounts");