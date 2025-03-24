import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ""  //Add a picture URL to something that will become a placeholder
  },
  unit: {  //Kilos, litres etc...
    type: String,
    enum: ['kg', 'L'],
    required: true
  },
  amount: {   //The number shown before unit type for a product
    type: Number,
    required: true
  },
  brand:  {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 1,
    min: 0,
    max: 1
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true

  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);