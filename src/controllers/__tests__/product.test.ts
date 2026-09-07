import request from "supertest";
import server from "../../server";

// POST
describe("POST /api/v1/products", () => {

    test("Should display validation errors", async () => {
        const response = await request(server).post('/api/v1/products').send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(4)

        expect(response.statusCode).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    test("Should validate that the price is greater than 0", async () => {
        const response = await request(server).post('/api/v1/products').send({
            name: "Alienware Monitor",
            price: "0"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)

        expect(response.statusCode).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    test("Should validate that the price is a number and greater than 0", async () => {
        const response = await request(server).post('/api/v1/products').send({
            name: "Alienware Monitor",
            price: "Example"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(2)

        expect(response.statusCode).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(1)
    })

    test("Should create a new product", async () => {
        const response = await request(server).post('/api/v1/products').send({
            name: "Product 1",
            price: 100
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("errors")
    })
})

// GET all
describe("GET /api/v1/products", () => {

    test("GET a JSON response with products", async () => {
        const response = await request(server).get('/api/v1/products')
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("data")
        expect(response.body).not.toHaveProperty("errors")
    })
})

// GET one
describe("GET /api/v1/products/:id", () => {

    test("Should return a 404 for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server).get(`/api/v1/products/${productId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Product not found")
    })

    test("Should check a valid ID in the URL", async () => {
        const response = await request(server).get('/api/v1/products/not-valid-url')
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Invalid product id")
    })

    test("GET a JSON response for a single product", async () => {
        const response = await request(server).get('/api/v1/products/1')
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("data")
    })
})

// PUT
describe("PUT /api/v1/products/:id", () => {

    test("Should check a valid ID in the URL", async () => {
        const response = await request(server)
            .put(`/api/v1/products/not-valid-id`)
            .send({
                name: "Alienware Monitor",
                availability: true,
                price: 500
            })
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Invalid product id")
        expect(response.body).not.toHaveProperty("data")
    })

    test("Should display validation error messages when updating a product", async () => {
        const response = await request(server)
            .put(`/api/v1/products/1`)
            .send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(5)
        expect(response.body.errors[0].msg).toBe("Name is required")

        expect(response.statusCode).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    test("Should validate that the price is greater than 0", async () => {
        const response = await request(server)
            .put(`/api/v1/products/1`)
            .send({
                name: "Alienware Monitor",
                availability: true,
                price: 0
            })
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Only positive numbers")

        expect(response.statusCode).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    test("Should return a 404 response for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server)
            .put(`/api/v1/products/${productId}`)
            .send({
                name: "Alienware Monitor",
                availability: true,
                price: 500
            })
        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Product not found")
        expect(response.statusCode).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    test("Should update a valid product", async () => {
        const response = await request(server).put(`/api/v1/products/1`).send({
            name: "Alienware Monitor",
            availability: true,
            price: 500
        })
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body).not.toHaveProperty("errors")
        expect(response.statusCode).not.toBe(400)
    })
})

// DELETE
describe("DELETE /api/v1/products/:id", () => {

    test("Should check a valid ID in the URL", async () => {
        const response = await request(server).delete(`/api/v1/products/not-valid-id`)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Invalid product id")
        expect(response.body).not.toHaveProperty("data")
    })

    test("Should return a 404 response for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/v1/products/${productId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Product not found")
        expect(response.statusCode).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    test("Should delete a valid product", async () => {
        const response = await request(server).delete(`/api/v1/products/1`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBe("Product deleted successfully")
        expect(response.body).not.toHaveProperty("errors")
        expect(response.statusCode).not.toBe(400)
        expect(response.statusCode).not.toBe(404)
    })
})