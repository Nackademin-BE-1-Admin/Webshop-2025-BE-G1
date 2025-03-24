import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { Router } from "express";

const testRouter = Router()


testRouter.post('/addProduct', async (req, res) => {

    try {
        const newProd = await Product.create(req.body)
        res.json({ message: `Product added successfully.`, product: newProd })
    } catch (error) {
        res.status(400)
        res.json({
            message: `Failed adding product.`,
            error: error?.message,
            errorObj: error
        })
    }

})

testRouter.post('/addCategory', async (req, res) => {
    try {
        const newCat = await Category.create({ name: req.body.name })
        res.json({ message: `Category added`, category: newCat })
    } catch (error) {
        res.status(400)
        res.json({
            message: `Failed adding product.`,
            error: error?.message,
            errorObj: error
        })
    }
})

export default testRouter