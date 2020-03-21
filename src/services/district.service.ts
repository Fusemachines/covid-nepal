import DistrictModel from "../models/district.model";
import { IDistrict, IDistrictFilter } from "../shared/interfaces";

export class DistrictService {

    getDistricts(
        { province }: IDistrictFilter
    ) {
        const districts = DistrictModel.find({
            ...(province ? { province } : {})
        }).select("-_id -createdDate -updatedDate -__v ").lean().exec();
        return districts;
    }
}