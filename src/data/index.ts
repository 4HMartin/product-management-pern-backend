import { exit } from "node:process"
import { db } from "../config/db"

const clearDB = async () => {
    try {
        await db.sync({force: true})
        console.log("Data deleted successfully.")
        exit(0) // 0 - exit clear
    } catch (e) {
        console.error(e)
        exit(1) // 1 - exit with error
    }
}
/**
 * The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched.
 * Third position on the array means the command-line arguments:
 * // package.json - scripts
 * "pretest": "ts-node ./src/data --clear"
 *
 * "pretest" is always executed before "test" script.
 */
if(process.argv[2] === "--clear") {
    clearDB()
}

