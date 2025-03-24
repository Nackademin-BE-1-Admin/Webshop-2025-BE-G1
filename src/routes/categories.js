import Category from "../models/Category.js";
import { Router } from "express";

const categoryRoutes = Router()

categoryRoutes.get("/", async (req, res) => {
    try {
        const cats = await Category.find({})
        res.json(cats)
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message,
            errorObj: error
        })
    }
})

export default categoryRoutes