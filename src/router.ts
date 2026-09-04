import { Router } from 'express';
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

// GET - ALL PRODUCTS
router.get('/', getProducts);

// GET - PRODUCT BY ID
router.get('/:id',
    // Validation
    param('id').isInt().withMessage('Invalid product id'),
    // Middlewares
    handleInputErrors,
    // Controller
    getProductById
);

// POST - CREATE A NEW PRODUCT
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
router.put('/:id',
    // Validation
    param('id')
        .isInt().withMessage('Invalid product id'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('price')
        .isNumeric().withMessage('Price must be a number')
        .notEmpty().withMessage('Price is required')
        .custom((value) => value > 0).withMessage('Only positive integer'),
    body('availability')
        .isBoolean().withMessage('Invalid product availability'),
    // Middlewares
    handleInputErrors,
    // Controller
    updateProduct
)

// PATCH - UPDATE PRODUCT AVAILABILITY
router.patch('/:id',
    // Validation
    param('id').isInt().withMessage('Invalid product id'),
    // Middlewares
    handleInputErrors,
    // Controller
    updateAvailability
)

// DELETE - REMOVE A PRODUCT (HARD DELETE)
router.delete('/:id',
    // Validation
    param('id').isInt().withMessage('Invalid product id'),
    // Middlewares
    handleInputErrors,
    // Controller
    deleteProduct
)