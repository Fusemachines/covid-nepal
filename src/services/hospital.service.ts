import HospitalModel from "../models/hospital.model";
import { ECovidTest } from "../shared/interfaces";


export class HospitalService {
    createHospital(data: any) {
        // create slug
        data.nameSlug = data.name.trim().toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        return HospitalModel.create(data);
    }

    getHospitals(query?: { district: string, province: number, covidTest: ECovidTest }) {
        const queryDistrict = query.district && query.district.replace(/,+$/g, "").split(',') || []

        // query filter
        let filter: any = {};
        if (queryDistrict.length) {
            filter = { ...filter, district: { $in: queryDistrict } }
        }

        if (query.covidTest !== undefined && query.covidTest !== ECovidTest.ALL) {
            filter = { ...filter, covidTest: query.covidTest === ECovidTest.AVAILABLE ? true : false }
        }

        return HospitalModel.find(filter).select("-__v").lean();
    }

    getCovidHospitals() {
        return HospitalModel.find({
            covidTest: true
        }).select("name contact nameSlug availableTime openDays availableBeds totalBeds").lean();
    }

    getHospitalBySlug(slug: string) {
        return HospitalModel.find({
            nameSlug: slug
        }).select("-__v").lean();
    }

    getHospitalById(id: string) {
        return HospitalModel.findById(id).select("-__v").lean();
    }

    async update(id: string, data: any) {
        const oldRecord:any = await HospitalModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()
        const nameSlug = data.name.trim().toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        if (oldRecord.slug !== nameSlug) {
            data.nameSlug = nameSlug
        }
        const newRecord = { ...oldRecord, ...data }

        return HospitalModel.findByIdAndUpdate(id, newRecord, { new: true })
    }

    delete(id: string) {
        return HospitalModel.findByIdAndRemove(id)
    }



}