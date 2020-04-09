import { Schema, model } from "mongoose";


const TagSchema = new Schema({
    name: {
        type: Schema.Types.String,
        unique: true,
        required: true
    }
})



const TagModel = model("tag", TagSchema, "tags");

export default TagModel;