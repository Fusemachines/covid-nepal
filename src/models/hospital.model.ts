import { model, Schema, } from "mongoose";
import paginate from "../shared/plugins/pagination.plugin"

const HospitalSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    nameSlug: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },

    priority: Schema.Types.Number,
    
    hospitalType: {
        type: Schema.Types.String
    },

    availableTime: {
        type: [Schema.Types.String],
        required: true
    },

    openDays: Schema.Types.String,

    location: {
        type: Schema.Types.String,
    },

    mapLink: Schema.Types.String,

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

    testingProcess: {
        type: Schema.Types.String
    },

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

    focalPoint: {
        type: Schema.Types.String
    },

    contact: {
        type: [Schema.Types.String]
    },


    ventilators: {
        type: Schema.Types.Number
    },

    province: {
        code: {
            type: Schema.Types.Number
        },
        name: {
            type: Schema.Types.String
        }
    },

    district: {
        type: Schema.Types.String
    }
}, {
    timestamps: true
});


HospitalSchema.plugin(paginate);

const HospitalModel = model("hospital", HospitalSchema, "hospitals");

export default HospitalModel;