
export enum EProvince {
    Province01 = 1,
    Province02 = 2,
    Province03 = 3,
    Province04 = 4,
    Province05 = 5,
    Province06 = 6,
    Province07 = 7
}
export interface IDistrictFilter {
    province: string;
}

export interface IDistrict {
    name: string;
    province: {
        code: EProvince;
        name: String
    } | EProvince
}