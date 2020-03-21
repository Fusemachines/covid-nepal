import { Schema, model } from "mongoose";


const DistrictSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "createdDate",
        updatedAt: "updatedDate"
    }
})
const DistrictModel = model("district", DistrictSchema, "districts");

export default DistrictModel;
