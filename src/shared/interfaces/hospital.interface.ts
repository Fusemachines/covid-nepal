import { IQuery } from "./http.interface";


export interface IHospitalFilter extends IQuery {
    district: string; province: number; covidTest: string; lang: string
}