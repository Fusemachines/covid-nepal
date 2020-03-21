import { Schema, model } from "mongoose";

const VirusCountSchema = new Schema({
    testedToday: {
        type: Schema.Types.Number
    },
    confirmedToday: {
        type: Schema.Types.Number
    },
    recoveredToday: {
        type: Schema.Types.Number
    },
    seriousToday: {
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
    seriousTotal: {
        type: Schema.Types.Number
    },
    deathTotal: {
        type: Schema.Types.Number
    },
    testedGlobal: {
        type: Schema.Types.Number
    },
    confirmedGlobal: {
        type: Schema.Types.Number
    },
    recoveredGlobal: {
        type: Schema.Types.Number
    },
    seriousGlobal: {
        type: Schema.Types.Number
    },
    deathGlobal: {
        type: Schema.Types.Number
    },
    district: {
        type: Schema.Types.String
    },
    province: {
        type: Schema.Types.String
    },
    createdDate: {
        type: Schema.Types.Date
    },
    updatedDate: {
        type: Schema.Types.Date,
        default: Date.now
    }

})


export const VirusCountModel = model("virusCount", VirusCountSchema, "virusCounts");