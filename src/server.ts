import express from 'express'
import {router} from "./router";
import {db} from "./config/db";

// DATABASE CONNECTION
async function connectDB(){
    try {
        await db.authenticate();
        db.sync(); // Sync all defined models to the DB.
        console.log("## DATABASE CONNECTED SUCCESSFULLY ##");

    } catch (error){
        console.log(error);
        console.log('## ERROR CONNECTING TO DATABASE ##');
    }
}
connectDB();

// EXPRESS INSTANCE
const server = express();

// ENABLE JSON ON REQUESTS
server.use(express.json());

// ROUTER
server.use('/api/v1/products', router);

export default server