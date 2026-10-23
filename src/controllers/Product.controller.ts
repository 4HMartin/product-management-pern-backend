import type {Request, Response} from "express";
import Product from "../models/Product.model";

// GET - ALL PRODUCTS
export async function getProducts(req: Request, res: Response) {
    const products = await Product.findAll({
        order: [['id', 'DESC']]
    });
    res.status(200).json({data: products})
}

// GET - PRODUCT BY ID
export async function getProductById(req: Request, res: Response) {
    const {id} = req.params;
    // const product = await Product.findOne({
    //     where: { id: req.params.id }
    // })
    const product = await Product.findByPk(id as string);
    if (!product) {
        res.status(404).json({error: "Product not found"})
    } else {
        res.status(200).json({data: product})
    }
}

// POST - CREATE A NEW PRODUCT
export async function createProduct(req: Request, res: Response) {
    const product = await Product.create(req.body);
    res.status(201).json({data: product});
}

// PUT - UPDATE A PRODUCT
export async function updateProduct(req: Request, res: Response) {
    const {id} = req.params;
    const product = await Product.findByPk(id as string);
    if (!product) {
        res.status(404).json({error: "Product not found"})
    }

    await product.update(req.body);
    await product.save();
    res.status(200).json({data: product});
}

// PATCH - UPDATE PRODUCT AVAILABILITY
export async function updateAvailability(req: Request, res: Response) {
    const {id} = req.params;
    const product = await Product.findByPk(id as string);
    if (!product) {
        res.status(404).json({error: "Product not found"})
    }
    // 'dataValues' Object that contains underlying model data.
    // Toggle the boolean value using negation operator '!'.
    product.availability = !product.dataValues.availability;
    await product.save();
    res.status(200).json({data: product});
}

// DELETE - REMOVE A PRODUCT (HARD DELETE)
export async function deleteProduct(req: Request, res: Response) {
    const {id} = req.params;
    const product = await Product.findByPk(id as string);
    if (!product) {
        res.status(404).json({error: "Product not found"})
    }
    await product.destroy();
    res.status(200).json({data: 'Product deleted successfully'});
}