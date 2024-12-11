import express from "express"
import { router } from "./router"
import SwaggerUi from "swagger-ui-express"
import { db } from "./config/db"
import colors from "colors"
import { SwaggerSpec, swaggerUiOptions } from "./config/swagger"
import cors, { CorsOptions } from "cors"
import morgan from "morgan"

export async function connectDb() {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.cyan.bold("Conexión exitosa"))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold("Ocurrió un error en la conexión"))
    }
}

connectDb()

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        console.log(origin)
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error'))
        }
    }
}

export const server = express()

server.use(cors(corsOptions))

server.use(morgan('dev'))

server.use(express.json())

server.use('/api/products', router)

server.use('/docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerSpec, swaggerUiOptions))

