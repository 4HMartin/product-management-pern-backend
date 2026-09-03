import { Router } from 'express';
import {getAllUsers, createProduct} from "./controllers/Product.controller";

export const router = Router();

router.get('/', getAllUsers);

router.post('/', createProduct);