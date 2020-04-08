import mongoose from "mongoose"
import { IDatabaseConnectionOptions } from "../shared/interfaces";
import { config } from "dotenv";
import { resolve } from "path";
import DistrictModel from "../models/district.model";
import { districts } from "./districts"

// import User from "../../components/user/model/user.model"
// import Project from "../../components/project/model/project.model"

const environment = process.env.NODE_ENV;

const { error } = config({
    path: resolve(__dirname, "../../", `.env.${environment}`)
});


if (error) {
    throw new Error(error.message);
}

class Seeder {
    constructor() {
        this.connectToDatabase({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
    }

    /**
     * Connect to MongoDB
     */
    public connectToDatabase(connOptions: IDatabaseConnectionOptions) {

        let connectionUri = `mongodb://${connOptions.username || ''}:${connOptions.password || ''}@${connOptions.host}:${connOptions.port}/${connOptions.database}`;

        mongoose.connect(connectionUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(async () => {
                console.log("Seeding...")
                await this.seed()

            })
            .catch(err => {
                console.log(`MongoDB connection error. Please make sure MongoDB is running ${err}`)
            })

        mongoose.set('useCreateIndex', true)
        mongoose.set('useFindAndModify', false)
    }

    /**
     * All Seeder registered here
     */
    private async seed(): Promise<void> {
        await this.seedDistricts();
    }


    private async seedDistricts() {
        await DistrictModel.deleteMany({});
        const updatedDistricts = districts.map(item => ({
            name: item.name,
            province: {
                code: item.province,
                name: `Province-0${item.province}`
            }
        }));
        await DistrictModel.insertMany(updatedDistricts);
        console.log("Seed Completed");
        process.exit();
    }

}

new Seeder()