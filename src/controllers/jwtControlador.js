import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";

dotenv.config();
const prisma = new PrismaClient();

export const iniciarSesion = async (req, res) => {
  try {
    const { user, contrasenia } = req.body;
    const usuario = await prisma.usuario.findUnique({
      where: {
        user: user,
      },
      // inner join
      include: {
        rol: true,
      },
    });

    // verificar si existe usuario
    if (!usuario) {
      return res
        .status(400)
        .json({ mensaje: "Usuario no encontrado", exito: false });
    }

    // verificar contraseña con bcrypt
    const validar = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!validar) {
      return res
        .status(400)
        .json({ mensaje: "Contraseña incorrecta", exito: false });
    }

    // identificador de usuario (payload)
    const payload = {
      usuarioId: usuario.idUsuario,
      user: usuario.user,
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
      mensaje: "Se logeo con exito",
      usuario: payload,
      exito: true,
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
    res.clearCookie("token", { httpOnly: true, maxAge: 720 * 60 * 60 * 1000 });
    res.status(204).json({ mensaje: "Se cerro sesion" });
  } catch (e) {
    console.error(e);
  }
};
