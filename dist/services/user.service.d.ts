/// <reference types="mongoose" />
export declare class UserService {
    getAllUsers(): Promise<Pick<import("mongoose").Document, "_id">[]>;
}
