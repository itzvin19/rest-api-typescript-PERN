import request from "supertest"
import { server } from "../../server"

describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: "hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors).not.toHaveLength(5)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 70
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
        expect(response.body).not.toHaveProperty('error')
    })

})

describe('GET /api/products', () => {
    it('should verify if api/products api exist', async () => {

        const response = await request(server).get('/api/products')

        expect(response.status).not.toBe(404)

    })

    it('should get a array with products', async () => {

        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
        expect(response.body.data).not.toHaveLength(2)

    })
})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {

        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBe("Producto no encontrado")

    })

    it('should check a valid ID in the url', async () => {

        const response = await request(server).get('/api/products/invalid-url')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no válido")

        expect(response.body).not.toHaveProperty('data')

    })

    it('get a JSON response for a single product', async () => {

        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {

        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Mouse - Testing",
            price: 999,
            availability: true
        })

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe("Producto no encontrado")

    })

    it('should verifiy if the ID is a number', async () => {

        const res = await request(server).put('/api/products/invalid-id').send({
            name: "Mouse - Testing",
            price: 999,
            availability: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no válido')

        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('data')

    })

    it('sould verify if the JSON is not empty', async () => {

        const res = await request(server).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('data')

    })

    it('sould verify if the availability is a boolean', async () => {

        const res = await request(server).put('/api/products/1').send({
            name: "Mouse - Testing",
            price: 999,
            availability: "hola"
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Valor no válido para disponibilidad')

        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('data')

    })

    it('sould verify if the availability is a number', async () => {

        const res = await request(server).put('/api/products/1').send({
            name: "Mouse - Testing",
            price: "hola",
            availability: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('sould verify if the availability is a number and greater than 0', async () => {

        const res = await request(server).put('/api/products/1').send({
            name: "Mouse - Testing",
            price: 0,
            availability: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe("Precio no válido")

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should update a product', async () => {
        const res = await request(server).put('/api/products/1').send({
            name: "Mouse - Testing - Updated",
            price: 200,
            availability: true
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should verify if the ID is a number', async () => {

        const res = await request(server).patch('/api/products/invalid-id')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('ID no válido')

        expect(res.status).not.toBe(200)
        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should verify if the product exists',async ()=>{
        const updateId=2000
        const res = await request(server).patch(`/api/products/${updateId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update the availability a product',async ()=>{

        const res = await request(server).patch('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {

        const productId = 2000

        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)

        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe("Producto no encontrado")

    })

    it('should delete a product', async () => {

        const response = await request(server).delete(`/api/products/1`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBe("Producto Eliminado")

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')

    })
})