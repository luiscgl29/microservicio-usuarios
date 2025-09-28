import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const getUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.payload;
    const usuario = await prisma.usuario.findUnique({
      where: {
        idUsuario: Number(usuarioId),
      },
    });
    return res.status(200).json({ mensaje: "Usted esta logeado", usuario });
  } catch (error) {}
};
