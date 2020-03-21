import HospitalModel from "../models/hospital.model";
import { ECovidTest } from "../shared/interfaces";


export class HospitalService {
    async createHospital(data: any) {
        const hospital = await HospitalModel.create(data);
        return hospital;
    }

    async getHospitals(query?: { district: string, province: number, covidTest: ECovidTest }) {
        const queryDistrict = query.district && query.district.replace(/,+$/g, "").split(',') || []

        // query filter
        let filter: any = {};
        if (queryDistrict.length) {
            filter = { ...filter, district: { $in: queryDistrict } }
        }

        if (query.covidTest !== undefined && query.covidTest !== ECovidTest.ALL) {
            filter = { ...filter, covidTest: query.covidTest === ECovidTest.AVAILABLE ? true : false }
        }
        const hospitals = await HospitalModel.find(filter).select("-__v").lean().exec();
        return hospitals;
    }

    async getCovidHospitals() {
        const hospitals = await HospitalModel.find({
            covidTest: true
        }).select("hospitalName availableTime openDays availableBeds totalBeds").lean().exec();
        return hospitals;
    }


    async getHospitalById(id: string) {
        const hospitalData = await HospitalModel.findById(id).select("-__v").lean().exec();
        return hospitalData;
    }

    async update(id: string, data: object) {
        const oldRecord = await HospitalModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()
        const newRecord = { ...oldRecord, ...data }

        return HospitalModel.findByIdAndUpdate(id, newRecord, { new: true })
    }

    delete(id: string) {
        return HospitalModel.findByIdAndRemove(id)
    }



}