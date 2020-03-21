import { model, Schema, } from "mongoose";


const HospitalSchema = new Schema({
    hospitalName: {
        type: Schema.Types.String,
        required: true
    },
    
    availableTime: {
        type: [Schema.Types.String],
        required: true
    },

    openDays: Schema.Types.String,

    location: {
        type: Schema.Types.String,
        required: true
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
        type: [Schema.Types.Number]
    },


    province: {
        code: {
            type: Schema.Types.Number,
            required: true
        },
        name: {
            type: Schema.Types.String,
            required: true
        }
    },

    district: {
        type: Schema.Types.String,
        required: true
    }
});



const HospitalModel = model("hospital", HospitalSchema, "hospitals");

export default HospitalModel;