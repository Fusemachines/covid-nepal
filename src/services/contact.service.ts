import ContactModel from "../models/contact.model";
import { IHospitalFilter } from "../shared/interfaces/contact.interface";

export class ContactService {


    createContact(data: any) {
        return ContactModel.create(data);
    }

    async getHospitals(
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

}