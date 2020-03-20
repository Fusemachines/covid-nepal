
export enum EProvince {
    Province01 = "Province-01",
    Province02 = "Province-02",
    Province03 = "Province-03",
    Province04 = "Province-04",
    Province05 = "Province-05",
    Province06 = "Province-06",
    Province07 = "Province-07"
}
export interface IDistrictFilter {
    province: string;
}

export interface IDistrict {
    name: string;
    province: EProvince
}