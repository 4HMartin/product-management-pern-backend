import type { Request, Response } from "express";
import Product from "../models/Product.model";
import {check, validationResult} from "express-validator";

export function getAllUsers(req: Request, res: Response) {
    console.log('GET - All Users');
    res.json({'message': 'All Users'});
}

// POST - CREATE A NEW PRODUCT
export async function createProduct(req: Request, res: Response){

    // Validation
    await check('name')
        .notEmpty().withMessage('Name is required')
        .run(req);
    await check('price')
        .isNumeric().withMessage('Price must be a number')
        .notEmpty().withMessage('Price is required')
        .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const product = await Product.create(req.body);
    res.status(201).json({ status: "success", product: product });
}