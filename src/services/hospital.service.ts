import HospitalModel from "../models/hospital.model";


export class HospitalService {
    
    async createHospital(data: any) {
        const hospital = await HospitalModel.create(data);
        return hospital;
    }

    async getHospitals() {
        const hospitals = await HospitalModel.find().select("-__v").lean().exec();
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



}