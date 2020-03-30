import swaggerJsDoc, { Options as SwaggerJsDocOptions } from "swagger-jsdoc";

import { resolve } from "path";


const CONTROLLERS = resolve(__dirname, "../../", "./controllers/*.controller.ts");
const options: SwaggerJsDocOptions = {
    swaggerDefinition: {
        info: {
            title: "Covid Nepal API ",
            version: "1.0.0",
            description: "Documentation for Covid Nepal APIs"
        },
    },
    apis: [CONTROLLERS]
}


export const specs = swaggerJsDoc(options);