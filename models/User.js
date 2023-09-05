import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: Number,
    country: String,
  },
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
  },
  token: {
    type: String,
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Referencia a la colección de órdenes
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

//HASHEO DE LA CONTRASEÑA
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error.message);
  }
});

//METODO PARA COMPARAR QUE EL PASSWORD SEA IGUAL AL QUE INTRODUCE EL USUARIO AL AUTENTICAR, POR ESO USA COMPARE CHECK PASSWORD
userSchema.methods.checkPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
