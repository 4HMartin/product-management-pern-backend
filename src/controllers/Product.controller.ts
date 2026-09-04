import type { Request, Response } from "express";
import Product from "../models/Product.model";

// GET - ALL PRODUCTS
export async function getProducts(req: Request, res: Response) {
    try {
        const products = await Product.findAll({ order: [['id', 'DESC']] });
        res.status(200).json({ data: products })
    } catch (error) {
        console.log(error);
    }
}

// GET - PRODUCT BY ID
export async function getProductById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        // const product = await Product.findOne({
        //     where: { id: req.params.id }
        // })
        const product = await Product.findByPk(id as string);
        if (!product) {
            res.status(404).json({ message: "Product not found" })
        } else {
            res.status(200).json({ data: product })
        }
    } catch (e) {
        console.log(e);
    }
}

// POST - CREATE A NEW PRODUCT
export async function createProduct(req: Request, res: Response){
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ data: product });
    } catch (error) {
        console.log(error);
    }
}