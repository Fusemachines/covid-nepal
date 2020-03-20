import DistrictModel from "../models/district.model";
import { IDistrict } from "../shared/interfaces";

export class DistrictService {

    async getDistricts(
        { province }: IDistrict
    ) {
        const districts = await DistrictModel.find({
            ...(province ? { province } : {})
        }).lean().exec();
        return districts;
    }
}