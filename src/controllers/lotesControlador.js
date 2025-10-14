import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const listarLotes = async (req, res) => {
  try {
    const lotes = await prisma.lote.findMany({
      include: {
        producto: {
          select: {
            idProducto: true,
            nombre: true,
            precioVenta: true,
            cantidadDisponible: true,
          },
        },
      },
    });

    // Asegurarte de que todos los lotes tengan un precioCompra numérico
    const lotesFormateados = lotes.map((l) => ({
      ...l,
      precioCompra: Number(l.precioCompra) || 0,
    }));

    res.status(200).json({ Lotes: lotesFormateados });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los lotes",
      detalle: error.message,
    });
  }
};
