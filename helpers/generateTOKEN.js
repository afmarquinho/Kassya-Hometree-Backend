import jwt from "jsonwebtoken";

const generateTOKEN = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
}

export default generateTOKEN


