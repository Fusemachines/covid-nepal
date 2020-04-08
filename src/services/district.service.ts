import DistrictModel from "../models/district.model";
import { IDistrictFilter } from "../shared/interfaces";

export class DistrictService {
    getDistricts({ province }: IDistrictFilter) {
        const districts = DistrictModel.find({
            ...(province ? { "province.code": province } : {})
        }).select("-_id -createdDate -updatedDate -__v  -province ").lean().exec();
        return districts;
    }
}