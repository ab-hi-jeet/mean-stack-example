import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());
        app.use("/employees", employeeRouter);

        const swaggerOption = {
            swaggerDefinition:{
                openapi:'3.0.0',
                info:{
                    title:"Employees API",
                    description:"Employee Information",
                    contact:{
                        name:"amazing Developer"
                    },
                    server:["http://localhost:5200"]
                }
            },
            apis:["./src/employee.routes.ts"]
        };
        
        const swaggerDocs = swaggerJsDoc(swaggerOption);
        app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocs));

        // start the Express server
        app.listen(5200, () => {
            console.log(`Server running at http://localhost:5200...`);
        });

    })
    .catch(error => console.error(error));
