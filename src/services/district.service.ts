import DistrictModel from "../models/district.model";
import { IDistrict, IDistrictFilter } from "../shared/interfaces";

export class DistrictService {

    async getDistricts(
        { province }: IDistrictFilter
    ) {
        const districts = await DistrictModel.find({
            ...(province ? { province } : {})
        }).lean().exec();
        return districts;
    }
}