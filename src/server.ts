import express from 'express'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from "swagger-ui-express"
import swaggerSpec, {swaggerUiOptions} from "./config/swagger"
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

// CORS - ALLOW FRONTEND REQUESTS
const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        } else {
            callback(new Error('CORS Error - Origin: ' + origin));
        }
    }
}
server.use(cors(corsOptions))

// ENABLE JSON ON REQUESTS
server.use(express.json())

// MORGAN LOGS
server.use(morgan('dev'))

// ROUTER
server.use('/api/v1/products', router)

// DOCS
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server