import { UserModel } from "../models/user.model";

export class UserService {

    async getAllUsers() {
        try {
            return await UserModel.find().exec();
        } catch (error) {
            throw new Error(error);
        }
    }

}