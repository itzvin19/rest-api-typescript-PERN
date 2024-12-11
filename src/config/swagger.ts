import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [{
            name: 'Products',
            description: 'REST APi for products'
        }],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            description: 'API DOCS for Products',
            version: '1.0.0'
        }
    },
    apis: ['./src/router.ts']
}

export const swaggerUiOptions: SwaggerUiOptions = {
    customSiteTitle: 'Documentacion del Sitio'
}
export const SwaggerSpec = swaggerJSDoc(options)