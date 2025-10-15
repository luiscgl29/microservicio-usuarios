import { PrismaClient, Prisma } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const crearCompra = async (req, res) => {
  try {
    const { idUsuario, totalCompra, compradetalle } = req.body;
    await prisma.$transaction(async (tx) => {
      // compra
      const compraGenerada = await tx.compra.create({
        data: {
          idUsuario,
          fecha: new Date(),
          totalCompra: new Prisma.Decimal(totalCompra),
        },
      });

      //detalles
      for (const detalle of compradetalle) {
        await tx.compradetalle.create({
          data: {
            ...detalle,
            idCompra: compraGenerada.idCompra,
          },
        });
      }

      return res.status(201).json({ mensaje: "Compra hecha" });
    });
  } catch (error) {
    console.error(error);
  }
};

export const listarCompras = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        compradetalle: true,
        usuario: true,
      },
    });
    return res.status(200).json({ mensaje: "Compras obtenidas", compras });
  } catch (error) {
    return res.stauts(500).json({ mensaje: "Ocurrio un error" });
  }
};
