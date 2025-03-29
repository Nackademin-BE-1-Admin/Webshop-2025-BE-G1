import { postmanConfig, documentRoute } from "../util/postmanConfig.js";

// Product routes
documentRoute({
    name: "Get all products",
    method: "GET",
    url: "/api/products"
})

documentRoute({
    name: "Get a single product by id",
    method: "GET",
    url: "/api/products/:id"
})

documentRoute({
    name: "Get all proucts of a given category",
    method: "GET",
    url: "/api/products/by-category/:category"
})

documentRoute({
    name: "Create a new product (admin only)",
    method: "POST",
    url: "/api/products",
    body: {
        "_": "product fields go here"
    }
})

documentRoute({
    name: "Update a product (Admin only)",
    method: "PUT",
    url: "/api/products/:id"
})

documentRoute({
    name: "Delete a product (Admin only) by id as URL parameter",
    method: "DELETE",
    url: "/api/products/:id"
})

documentRoute({
    name: "Delete a product (Admin only) by id OR name in JSON body",
    method: "DELETE",
    url: "/api/products",
    body: {
        id: "ID OR NAME GOES HERE"
    }
})

// Category Routes
documentRoute({
    name: "Get all categories",
    method: "GET",
    url: "/api/categories"
})

// Test routes
documentRoute({
    name: "Add a product",
    method: "POST",
    url: "/api/test/addProduct",
    body: {
        "_": "Product fields go here"
    }
})

documentRoute({
    name: "Add multiple products",
    method: "POST",
    url: "/api/test/addProducts",
    body: [
        {},
        {},
        {}
    ]
})

documentRoute({
    name: "Add a category",
    method: "POST",
    url: "/api/test/addCategory",
    body: {
        "name": "Category name"
    }
})

documentRoute({
    name: "Add multiple categories",
    method: "POST",
    url: "/api/test/addCategories",
    body: [
        {},
        {},
        {}
    ]
})

documentRoute({
    name: "Delete all products",
    method: "DELETE",
    url: "/api/test/purgeProducts"
})

documentRoute({
    name: "Delete all categories",
    method: "DELETE",
    url: "/api/test/purgeCategories"
})

documentRoute({
    name: "Delete all products and categories",
    method: "DELETE",
    url: "/api/test/purgeAll"
})

const apiDocumentation = (req, res) => {
    res.json(postmanConfig)
}

export default apiDocumentation