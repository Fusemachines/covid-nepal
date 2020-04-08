import { Schema, model, Types } from "mongoose";


const DistrictSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    province: {
        code: Schema.Types.Number,
        name: Schema.Types.String
    }
}, {
    timestamps: {
        createdAt: "createdDate",
        updatedAt: "updatedDate"
    }
})
const DistrictModel = model("district", DistrictSchema, "districts");

export default DistrictModel;
