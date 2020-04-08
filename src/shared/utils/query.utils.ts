import { ESortOrder, IPagination, ISort } from "../interfaces/http.interface";

export function getSorting(query: ISort) {
    const { order, orderBy } = query;
    if (order === "" || orderBy === "") {
        return {};
    }
    const sort = {
        ...(order === ESortOrder.ASC || order === ESortOrder.DESC ? {
            [orderBy || "_id"]: order
        } : {})
    }
    return { sort };
}


export function getPagination(query: IPagination) {
    const {
        size, page
    } = query;

    if (page === undefined || size === "" || page === "") {
        return {}
    }
    const pagination = {
        limit: Number(query.size) || 25,
        page: Number(query.page)
    }
    return pagination;

}