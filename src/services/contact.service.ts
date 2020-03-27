import ContactModel from "../models/contact.model";
import { IHospitalFilter, IHospitalContact } from "../shared/interfaces/contact.interface";
import HospitalModel from "../models/hospital.model";

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
        
        const contacts = new Array();

        await HospitalModel.find({
            'province.code': province,
            ...(districtArray.length > 0 ? {
                'district.en': {
                    $in: districtArray
                }
            } : {})
        }, (error:any, hospitals:any) => {
            if (error) {
                console.log('Error occured while fetching hospitals')
                throw error;
            }

            hospitals.forEach(function (hospital:any) {
                const contact: IHospitalContact = {
                    name: hospital.get('name'),
                    landLine: hospital.get('contact')
                }

                contacts.push(contact);
            })
        });

        return contacts;
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