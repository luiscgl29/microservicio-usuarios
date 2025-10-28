import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const listarRoles = async (req, res) => {
  try {
    const datos = await prisma.rol.findMany();
    res.status(200).json({ roles: datos });
  } catch (error) {
    console.error(error);
  }
};
