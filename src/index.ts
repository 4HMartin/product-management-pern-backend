import server from "./server"

const PORT = process.env.PORT || 4000;
server.listen(4000, () => {
    console.log(`Server running on port ${PORT}`);
})