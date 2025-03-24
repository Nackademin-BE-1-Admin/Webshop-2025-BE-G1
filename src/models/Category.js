import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 100
    }
})

const Category = model('category', categorySchema, 'categories')

export default Category