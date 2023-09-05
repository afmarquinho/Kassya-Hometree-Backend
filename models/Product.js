import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Puede ser una referencia a una colección de categorías
    ref: "Category",
    required: true,
  },
  brand: String,

  imageURLs: [String], // Puede ser un array de URLs si hay varias imágenes del producto
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    trim: true,
  },
  isInPromotion: {
    type: Boolean,
    default: false,
  },
  promotionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  attributes: {
    // Pueden ser atributos específicos como color, tamaño, material, etc.
    color: String,
    size: String,
    material: String,
    // ...
  },
  ratings: [
    {
      rating: Number,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencia a la colección de usuarios para relacionar las calificaciones con usuarios específicos
      },
      review: String,
      // Fecha de la calificación o reseña
      createdAt: { type: Date, default: Date.now },
    },
  ],
  // Información de envío
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      trim: true,
    },
    // ...
  },
  // Información de variantes (por ejemplo, si vendes ropa en diferentes tallas y colores)
  variants: [
    {
      attributes: {
        color: String,
        size: String,
        trim: true,
      },
      price: Number,
      stockQuantity: Number,
      trim: true,
    },
  ],
  // Fecha de creación del producto
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
