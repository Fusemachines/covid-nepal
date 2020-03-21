import ContactModel from "../models/contact.model";
import { IHospitalFilter } from "../shared/interfaces/contact.interface";

export class ContactService {


    createContact(data: any) {
        return ContactModel.create(data);
    }

    async getHospitals(
        province: number,
        {
            district
        }: IHospitalFilter
    ) {
        let districtArray: string[] = [];

        if (district) {
            districtArray = district.split(",");
        }

        const hospitals = await ContactModel.find({
            contactType: "hospital",
            province: province,
            ...(districtArray.length > 0 ? {
                district: {
                    $in: districtArray
                }                
            } : {})
        }).lean().exec();

        return hospitals;
    }


    async getEmergencyContacts() {
        const emergencyContacts = await ContactModel.find({
            contactType: {
                $not: /hospital/
            }
        }).lean().exec();
        return emergencyContacts;
    }

    async removeContactById(id: string) {
        return ContactModel.findByIdAndRemove(id);
    }

    async updateContactById(id: string, data: any) {
        const oldRecord: any = await ContactModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean();
        const newRecord = { ...oldRecord, ...data }
        return ContactModel.findByIdAndUpdate(id, newRecord, { new: true })
    }
    
}