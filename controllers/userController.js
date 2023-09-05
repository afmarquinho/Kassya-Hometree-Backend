import User from "../models/User.js";
import generateID from "../helpers/generateID.js";
import { emailForgotPassword, emailRegister } from "../helpers/email.js";
import generateTOKEN from "../helpers/generateTOKEN.js";


//---------------------------------------//
//* REGISTER
//---------------------------------------//
const register = async (req, res) => {
  const { email, phoneNumber } = req.body;
  try {
    //? VALIDATE EMAIL IS NEW
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      const error = new Error("Correo ya registrado");
      return res.status(400).json({ msg: error.message });
    }
    //? VALIDATE PHONENUMBER IS NEW
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      const error = new Error("Número de teléfono ya registrado");
      return res.status(400).json({ msg: error.message });
    }

    const newUser = new User(req.body);
    newUser.token = generateID();

    try {
      await newUser.save();

      emailRegister({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token,
      });
    } catch (saveError) {
      console.error("Error al guardar el usuario:", saveError);
      res.status(500).json({ msg: "Error al guardar el usuario" });
    }
    res.status(201).json({
            msg: "Usuario Creado Correctamente, revisa tu email para confirmar tu cuenta",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error en el servidor" });
  }
};
//---------------------------------------//
//* CONFIRMAION
//---------------------------------------//
const confirmation = async (req, res) => {
  //? VALIDATE IF TOKEN EXISTS
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Token no válido  ");
    return res.status(404).json({ msg: error.message });
  }
  try {
    user.confirmed = true;
    user.token = "";
    await user.save();
    const name = user.name;
    const capitalizedFirstName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const responseMessage = `¡Hola ${capitalizedFirstName}!, tu cuenta ha sido confirmada con éxito.`;
    res.status(200).json({ msg: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error en el servidor" });
  }
};
//---------------------------------------//
//* AUTHENTICATION
//---------------------------------------//
const authentication = async (req, res) => {
  //? VALIDATE THAT NAME AND EMAIL EXISTS AND ASSIGN IT TO USER
  const { nameEmail, password } = req.body;

  try {
    let user = null;
    const userByEmail = await User.findOne({ email: nameEmail });
    const userByName = await User.findOne({ name: nameEmail });

    if (userByEmail) {
      user = userByEmail;
    } else {
      user = userByName;
    }

    if (!user) {
      const error = new Error("El usuario, email o contraseña son incorrectos");
      return res.status(404).json({ msg: error.message });
    }

    //? VALIDATE IF USER IS ALREADY CONFIRMED
    if (!user.confirmed) {
      const error = new Error("Tu Cuenta no ha sido confirmada");
      return res.status(403).json({ msg: error.message });
    }
    //? VALIDATE PASSWORD IS CORRECT, THIS METHOD COMES FROM SCHEMA
    if (await user.checkPassword(password)) {
      //? to use to show profile
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateTOKEN(user._id),
      });
    } else {
      const error = new Error("El usuario, email o contraseña son incorrectos");
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error en el servidor" });
  }
};
//---------------------------------------//
//* FOGOT PASSWORD
//---------------------------------------//
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("El correo no existe");
      res.status(404).json({ msg: error.message });
    }
    user.token = generateID();
    await user.save();
    emailForgotPassword({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res
      .status(200)
      .json({ msg: "Hemos enviado un email con las instrucciones" });
    //? VALIDATE EMAIL IS TRUE
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error en el servidor" });
  }
};
//---------------------------------------//
//* CHECK TOKEN
//---------------------------------------//
const checkToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });
  try {
    if (!validToken) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
    res.json({ msg: "Token válido y el Usuario existe" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error en el servidor" });
  }
};
//---------------------------------------//
//* NEW PASSWORD
//---------------------------------------//
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
    user.password = password;
    user.token = "";
    await user.save();
    res.json({ msg: "Password Modificado Correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Ha ocurrido un error en el servidor" });
  }
};

export {
  register,
  confirmation,
  authentication,
  forgotPassword,
  checkToken,
  newPassword,
};
