import express from 'express'
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./config/swagger"
import {router} from "./router"
import {db} from "./config/db"

// DATABASE CONNECTION
export async function connectDB(){
    try {
        await db.authenticate();
        await db.sync(); // Sync all defined models to the DB.
        // console.log("## DATABASE CONNECTED SUCCESSFULLY ##")

    } catch (error){
        console.log(error);
        console.log('## ERROR CONNECTING TO DATABASE ##')
    }
}

// EXPRESS INSTANCE
const server = express()

// ENABLE JSON ON REQUESTS
server.use(express.json())

// ROUTER
server.use('/api/v1/products', router)

// DOCS
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default server