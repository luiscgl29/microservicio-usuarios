import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verificarJwt = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(403)
        .json({ mensaje: "No ha iniciado sesion.", exito: false });
    }
    // token decifrado
    const infoUsuario = jwt.verify(token, process.env.JWT_SECRETO);
    req.payload = infoUsuario;
    next();
  } catch (e) {
    console.error(e);
  }
};
