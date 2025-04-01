import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { toUserDTO } from "../util/dto.js";
import { Router } from "express";

const testRouter = Router()


testRouter.post('/addProduct', async (req, res) => {

    try {
        const id = await validateCategory(req.body.category);
        if (!id) {
            res.status(404)
            res.json({
                error: `No category found by value: ${req.body.category}. Ensure the request body's "category" field is either the category name or the category id.`
            })
            return;
        }

        req.body.category = id;
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

testRouter.post('/addProducts', async (req, res) => {

    const products = req.body;

    // Validate body is array
    if (!Array.isArray(products)) {
        res.status(400)
        res.json({ error: "Request body must be an array/list. "})
        return
    }

    try {
        let addedProducts = []
        let failedProducts = []

        for (const product of products) {
            // validate category
            const id = await validateCategory(product.category);
            if (!id) {
                failedProducts.push({
                    product,
                    error: `No category found by value: ${product.category}. Ensure the product's "category" field is either the category name or the category id.`
                })
                continue;
            }
            product.category = id;

            try {
                const newProduct = await Product.create(product)
                addedProducts.push(newProduct)
            } catch (error) {
                failedProducts.push({ product, error: error?.message })
            }
        } // end loop

        if (failedProducts.length) {
            res.status(400)
            res.json({
                failedProducts,
                addedProducts,
                error: `${failedProducts.length} products could not be added.`
            })
            return
        }

        res.json({
            message: `Success!`,
            addedProducts
        })

    } catch (error) {
        res.status(500)
        res.json({
            message: `Something went wrong.`,
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

testRouter.post('/addCategories', async (req, res) => {
    // validate array
    const categories = req.body;
    if (!Array.isArray(categories)) {
        res.status(400)
        res.json({ error: `Request body must be an array/list.` })
        return
    }

    const addedCategories = []
    const failedCategories = []

    for (const cat of categories) {
        try {
            const newCat = await Category.create({ name: cat.name })
            addedCategories.push(newCat)
        } catch (error) {
            failedCategories.push({ category: cat, error: error?.message })
        }
    }

    if (failedCategories.length) {
        res.status(400)
        res.json({
            error: `${failedCategories.length} categories failed to be added.`,
            failedCategories,
            addedCategories
        })
        return
    }

    res.json({
        message: `Success!`,
        categories: addedCategories
    })

})

testRouter.delete('/purgeProducts', async (req, res) => {
    try {
        await Product.deleteMany({})
        res.json({ message: `All products deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

testRouter.delete('/purgeCategories', async (req, res) => {
    try {
        await Category.deleteMany({})
        res.json({ message: `All categories deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

testRouter.delete('/purgeUsers', async (req, res) => {
    try {
        await User.deleteMany({})
        res.json({ message: `All users deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

testRouter.delete('/purgeAll', async (req, res) => {
    try {
        await Product.deleteMany({})
        await Category.deleteMany({})
        await User.deleteMany({})
        res.json({ message: `All products, categories, and users deleted.` })
    } catch (error) {
        res.status(500)
        res.json({
            error: error?.message
        })
    }
})

testRouter.get('/users', async (req, res) => {
    try {    
        console.log('finding users')
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({ error: error?.message })
    }
})

testRouter.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        const token = jwt.sign({username: newUser.username}, process.env.JWT_SECRET, { expiresIn: "2w"})

        res.cookie('hakim-livs-token', token)

        res.json({
            user: toUserDTO(newUser),
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error?.message })
    }
})

testRouter.post('/users/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username }).lean()
        if (!foundUser) throw { message: "Username doesn't match any documents." };
        const validPassword = await bcrypt.compare(req.body.password, foundUser.password)
        if (!validPassword) throw { message: "Password is wrong." }
        const token = jwt.sign(foundUser, process.env.JWT_SECRET || "livs-hakim", { expiresIn: "2w"})
        res.cookie('hakim-livs-token', token)

        res.json({
            user: toUserDTO(foundUser),
            token
        })
    } catch (error) {
        res.status(400)
        res.json({ error: error?.message })
        return
    }
})

testRouter.get('/users/me', async (req, res) => {
    try {
        const token = req.cookies['hakim-livs-token']
        if (!token) throw { message: "You do not have a cookie called 'hakim-livs-token'." }

        // verify token
        const userData = jwt.verify(token, process.env.JWT_SECRET || "livs-hakim")

        // find user
        const foundUser = await User.findOne({ username: userData.username })
        if (!foundUser) throw { message: "The cookie contained a valid token but it did not reference an existing user. Maybe the user no longer exists, or has changed their username." };

        res.json(toUserDTO(foundUser))

    } catch (error) {
        res.status(400)
        res.json({ error: error?.message })
    }
})

testRouter.get('/users/logout', async (req, res) => {
    res.cookie('hakim-livs-token', '')
    res.json({ message: 'Your cookie has been deleted' })
})

testRouter.post('/insertDocs', async (req, res) => {

    let createdCount = 0
    let failedCount = 0
    const created = {}
    const failed = {}

    try {
        if (req.body.purgeAllFirst) {
            await User.deleteMany({})
            await Product.deleteMany({})
            await Category.deleteMany({})
        }

        const insertDocs = async (key) => {
            const model = ({users: User, products: Product, categories: Category})[key];

            if (!model) {
                res.status(400)
                res.json({ error: `${key} is not a valid model.` })
                return
            }

            created[key] = [];
            failed[key] = []

            for (const doc of req.body[key]) {
                try {                    
                    const newDoc = await model.create(doc)
                    created[key].push(newDoc)
                    createdCount++
                } catch (error) {
                    failed[key].push({
                        error: error?.message,
                        doc
                    })
                    failedCount++
                }
            }
        }

        await insertDocs('categories')
        await insertDocs('products')
        await insertDocs('users')
  
        res.json({
            message: `${createdCount} succeeded and ${failedCount} failed.`,
            created,
            failed
        })
    } catch (error) {
        res.status(500)
        res.json({ error: error?.message })
    }
})

// helpers
const validateCategory = async (nameOrId) => {
    try {

        const foundByName = await Category.findOne({ name: nameOrId })
        if (foundByName) return foundByName._id;

        const foundById = await Category.findById(nameOrId)
        if (foundById) return foundById._id;

    } catch (_) {
        return undefined
    }
}

export default testRouter