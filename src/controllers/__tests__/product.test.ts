import request from "supertest";
import server from "../../server";

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