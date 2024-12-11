import { Router } from "express";
import { createProducts, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/product";
import { body, param } from "express-validator";
import { validateProductInput } from "./middleware";

export const router = Router()

/**
 * @swagger
 *      components:
 *          schemas:
 *              Product:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                          example: 1
 *                          description: Product Id
 *                      name:
 *                          type: string
 *                          example: Mouse Logitech ZZW20
 *                          description: Product Name
 *                      price:
 *                          type: integer
 *                          example: 342
 *                          description: Product Price
 *                      availability:
 *                          type: boolean
 *                          example: true
 *                          description: Product Availability
 *              ResponseWithDataMulti:
 *                  type: object
 *                  properties:
 *                       data:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 *              ResponseWithDataSingle:
 *                  type: object
 *                  properties:
 *                       data:
 *                          $ref: '#/components/schemas/Product'
 * 
*/

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful Response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ResponseWithDataMulti'
 * 
 * 
 * 
 * 
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get the info of a Product
 *          tags: 
 *              - Products
 *          description: The list of a product
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: integer
 *                description: The ID of a product
 *          responses:
 *              200:
 *                  description: Get the info of a product into a JSON
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ResponseWithDataSingle'
 *              404:
 *                  description: Product Not Found
 *              400:
 *                  description: Bad Request - Invalid ID
 * 
 */
router.get('/:id',
    param('id')
        .isInt().withMessage('ID no válido'),
    validateProductInput,
    getProductById)

/**
 * @swagger
 * /api/products/:
 *  post:
 *      summary: Create a product
 *      tags:
 *          - Products
 *      description: Create a product with name and price
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Teclado Red Dragon
 *                          price:
 *                              type: number
 *                              example: 322
 *      responses:
 *          201:
 *              description: Product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseWithDataSingle'
 *          400:
 *              description: Bad Request - Invalid Input Data
 * 
 */
router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre es necesario'),
    body('price')
        .notEmpty().withMessage("El precio es necesario")
        .isNumeric().withMessage("El precio no es válido")
        .custom(value => value > 0).withMessage("Precio no válido"),
    validateProductInput,
    createProducts
)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Updates a product
 *          tags:
 *              - Products
 *          description: Update a product whith ID and Input Data
 *          parameters:
 *              - in: path
 *                name: ID
 *                required: true
 *                schema:
 *                  type: integer
 *                description: The ID of a product
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Mouse Chinito
 *                              price:
 *                                  type: integer
 *                                  example: 70
 *                              availability:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Succesfully Update
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ResponseWithDataSingle'
 *              404:
 *                  description: Product Not Found
 *              400:
 *                  description: Bad Request - Invalid Input Data
 */
router.put('/:id',
    param('id')
        .isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre es necesario'),
    body('price')
        .notEmpty().withMessage("El precio es necesario")
        .isNumeric().withMessage("El precio no es válido")
        .custom(value => value > 0).withMessage("Precio no válido"),
    body('availability')
        .isBoolean().withMessage("Valor no válido para disponibilidad"),
    validateProductInput,
    updateProduct)

/**
 * @swagger
 *  /api/products/{id}:
 *      patch:
 *          summary: Switch availability
 *          tags:
 *              - Products
 *          description: Update the availability of a product switching the current availability
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: integer
 *              required: true
 *              description: The ID of a product
 *          responses:
 *              200:
 *                  description: Succesfully switch on availability
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ResponseWithDataSingle'
 *              404:
 *                  description: Product Not Found
 *              400: 
 *                  description: Bad Request - Invalid Input Data 
 */
router.patch('/:id',
    param('id')
        .isInt().withMessage('ID no válido'),
    validateProductInput,
    updateAvailability)

/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Delete a product
 *          description: Delete a product hit his ID
 *          tags:
 *              - Products
 *          parameters:
 *            - in: path
 *              name: ID
 *              required: true
 *              schema:
 *                  type: integer
 *              description: The ID of a product
 *          responses:
 *              200:
 *                  description: Successfully delete
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data: 
 *                                      type: string
 *                                      example: Producto eliminado
 *              404: 
 *                  description: Product Not Found
 *              400:
 *                  description: Bad Request - Invalid Input Data
 */

router.delete('/:id',
    param('id')
        .isInt().withMessage('ID no válido'),
    validateProductInput,
    deleteProduct
)