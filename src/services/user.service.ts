import { UserModel } from "../models/user.model";

export class UserService {

    async getAllUsers() {
        try {
            const users = [{
                name: "user1",
                email: "user1@mail.com"
            }]
            return users;
        } catch (error) {
            throw new Error(error);
        }
    }

}