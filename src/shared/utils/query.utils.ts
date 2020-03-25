import { ESortOrder } from "../interfaces/http.interface";

interface IQuery {
    order: ESortOrder;
    orderBy: string;
    page: number | string;
    size: number | string;

}

export function getSorting(query: IQuery) {
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


export function getPagination(query: IQuery) {
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