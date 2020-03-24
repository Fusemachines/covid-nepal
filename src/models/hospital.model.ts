import { model, Schema, } from "mongoose";
import { LangSchema } from "../shared/schemas";

const HospitalSchema = new Schema({
    name: {
        type: LangSchema,
        unique: true
    },

    nameSlug: {
        type: Schema.Types.String,
        required: true
    },

    hospitalType: LangSchema,

    availableTime: {
        type: [LangSchema],
        required: true
    },

    openDays: LangSchema,

    location: {
        type: LangSchema,
        required: true
    },

    mapLink: LangSchema,

    coordinates: {
        type: [Schema.Types.Number],
    },

    // beds availability
    totalBeds: Schema.Types.Number,
    availableBeds: Schema.Types.Number,

    //  covid test available ?
    covidTest: {
        type: Schema.Types.Boolean
    },

    testingProcess: LangSchema,

    // designated by government ?
    govtDesignated: {
        type: Schema.Types.Boolean
    },


    numIsolationBeds: {
        type: Schema.Types.Number
    },

    icu: {
        type: Schema.Types.Number
    },

    focalPoint: LangSchema,

    contact: {
        type: [LangSchema]
    },

    province: {
        code: {
            type: Schema.Types.Number,
            required: true
        },
        name: {
            type: LangSchema,
            required: true
        }
    },
    district: {
        type: LangSchema,
        required: true
    }
}, {
    timestamps: true
});



const HospitalModel = model("hospital", HospitalSchema, "hospitals");

export default HospitalModel;