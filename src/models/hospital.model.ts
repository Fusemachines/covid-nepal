import { model, Schema, } from "mongoose";
import { LangSchema } from "../shared/schemas";
import paginate from "../shared/plugins/pagination.plugin";

const HospitalSchema = new Schema({
    name: {
        type: LangSchema,
        required: true
    },
    nameSlug: {
        type: Schema.Types.String,
        unique: true,
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

    mapLink: {
        type: Schema.Types.String
    },

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

    isVerified: {
        type: Schema.Types.Boolean,
        required: true
    },

    numIsolationBeds: {
        type: Schema.Types.Number
    },

    icu: {
        type: Schema.Types.Number
    },

    authorizedCovidTest: {
        type: Schema.Types.Boolean
    },

    priority: {
        type: Schema.Types.Number,
    },

    focalPoint: {
        type: LangSchema
    },

    contact: {
        type: [LangSchema]
    },
    ventilators: Schema.Types.Number,

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

HospitalSchema.plugin(paginate);


const HospitalModel:any = model("hospital", HospitalSchema, "hospitals");

export default HospitalModel;