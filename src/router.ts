import {Router} from 'express';
import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    updateAvailability, deleteProduct
} from "./controllers/Product.controller";
import {body, param} from "express-validator";
import {handleInputErrors} from "./middlewares";

export const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
 *                  description: The Product ID
 *              name:
 *                  type: string
 *                  example: Alienware Monitor 49 Oled
 *                  description: The Product name
 *              price:
 *                  type: number
 *                  example: 600
 *                  description: The Product price
 *              availability:
 *                  type: boolean
 *                  example: true
 *                  description: The Product availability
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  example: 2026-09-07T13:05:03.061Z
 *                  description: The Product creation date
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  example: 2026-09-07T13:05:03.061Z
 *                  description: The Product last update date
 */

// GET - ALL PRODUCTS
/**
 * @swagger
 * /api/v1/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts);

// GET - PRODUCT BY ID
/**
 * @swagger
 * /api/v1/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *            - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found
 *              400:
 *                  description: Bad Request - Invalid ID
 */
router.get('/:id',
    // Validation
    param('id').isInt().withMessage('Invalid product id'),
    // Middlewares
    handleInputErrors,
    // Controller
    getProductById
);

// POST - CREATE A NEW PRODUCT
/**
 * @swagger
 * /api/v1/products:
 *      post:
 *          summary: Creates a new product
 *          tags:
 *            - Products
 *          description: Returns a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Razer Tournament Edition keyboard"
 *                              price:
 *                                  type: number
 *                                  example: 180
 *          responses:
 *              201:
 *                  description: Product created successfully
 *              400:
 *                  description: Bad Request - Invalid input data
 */
router.post('/',
    // Validation
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('price')
        .isNumeric().withMessage('Price must be a number')
        .notEmpty().withMessage('Price is required')
        .custom((value) => value > 0).withMessage('Only positive integer'),
    // Middlewares
    handleInputErrors,
    // Controller
    createProduct
);

// PUT - UPDATE A PRODUCT
/**
 * @swagger
 * /api/v1/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *        - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Alienware monitor 49'"
 *                          price:
 *                              type: number
 *                              example: 600
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 */
router.put('/:id',
    // Validation
    param('id')
        .isInt().withMessage('Invalid product id'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('price')
        .isNumeric().withMessage('Price must be a number')
        .notEmpty().withMessage('Price is required')
        .custom((value) => value > 0).withMessage('Only positive numbers'),
    body('availability')
        .isBoolean().withMessage('Invalid product availability'),
    // Middlewares
    handleInputErrors,
    // Controller
    updateProduct
)

// PATCH - UPDATE PRODUCT AVAILABILITY
/**
 * @swagger
 * /api/v1/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *        - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */
router.patch('/:id',
    // Validation
    param('id').isInt().withMessage('Invalid product id'),
    // Middlewares
    handleInputErrors,
    // Controller
    updateAvailability
)

// DELETE - REMOVE A PRODUCT (HARD DELETE)
/**
 * @swagger
 * /api/v1/products/{id}:
 *  delete:
 *      summary: Deletes a product by a given ID
 *      tags:
 *        - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: "Product deleted successfully"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */
router.delete('/:id',
    // Validation
    param('id').isInt().withMessage('Invalid product id'),
    // Middlewares
    handleInputErrors,
    // Controller
    deleteProduct
)