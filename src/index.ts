import server, {connectDB} from "./server"

// Database connection
connectDB()

const PORT = process.env.PORT || 4000;
server.listen(4000, () => {
    console.log(`Server running on port ${PORT}`)
})