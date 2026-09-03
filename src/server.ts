import express from 'express'

const server = express()

// Routing
server.get('/', (req, res) => {

    res.json({
        message: 'Hello World!',
    })
})

export default server