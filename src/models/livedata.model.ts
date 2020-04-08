import { Schema, model } from "mongoose";

const LiveDataSchema = new Schema({
    nameOfHospital: {
        type: Schema.Types.String   
    },
    numberOfBed: {
        type: Schema.Types.Number,
        required: true
    },
    numberOfPatient: {
        type: Schema.Types.Number,
    },
    covid19Symptom: {
        type: Schema.Types.Number,
    },
    covid19SymptomPercentage: {
        type: Schema.Types.Number,
    },
    province: {
        type: Schema.Types.String,
        required: true
    },
    district: {
        type: Schema.Types.String,
        required: true
    },
}, { timestamps: true })

export default model("LiveData", LiveDataSchema, "livedata");