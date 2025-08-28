import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/index.js";

dotenv.config();
const prisma = new PrismaClient();

export const iniciarSesion = async (req, res) => {
  try {
    const { nombre, contrasenia } = req.body;
    const usuario = await prisma.usuario.findUnique({
      where: {
        nombre: nombre,
      },
      // inner join
      include: {
        rol: true,
      },
    });
    // ver si la contra es correcta
    if (usuario.contrasenia !== contrasenia) {
      return res.status(400).json({ mensaje: "No es la contrasenia" });
    }
    // identificador de usuario (payload)
    const payload = {
      usuarioId: usuario.idUsuario,
      nombre: usuario.nombre,
      rol: usuario.rol.nombreRol,
    };

    // jwt
    const token = jwt.sign(payload, process.env.JWT_SECRETO, {
      expiresIn: "30d",
    });

    // enviar cookie para que se recuerde quien es
    res.cookie("token", token, {
      httpOnly: true,
      // 30 dias
      maxAge: 720 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      mensaje: "Se logeo!",
      usuario: payload,
    });
  } catch (e) {
    console.error(e);
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies.token) {
      return res.status(204).json({ mensaje: "No tiene token" });
    }
    const tokenRefresco = cookies.tokenRefresco;
    res.clearCookie("token", { httpOnly: true, maxAge: 720 * 60 * 60 * 1000 });
    res.status(204).json({ mensaje: "Se cerro sesion" });
  } catch (e) {
    console.error(e);
  }
};
