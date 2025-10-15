import { PrismaClient, Prisma } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearVenta = async (req, res) => {
  try {
    const { idUsuario, totalVenta, detallesventa } = req.body;
    await prisma.$transaction(async (tx) => {
      // venta
      const ventaGenerado = await tx.venta.create({
        data: {
          idUsuario,
          fecha: new Date(),
          totalVenta: new Prisma.Decimal(totalVenta),
        },
      });

      // detalles
      await tx.detalleventa.createMany({
        data: detallesventa.map((detalle) => ({
          ...detalle,
          idVenta: ventaGenerado.idVenta,
        })),
      });
      return res.status(201).json({ mensaje: "Creado" });
    });
  } catch (e) {
    console.error("Error al registrar la venta:", e.message);
    res.status(500).json({
      mensaje: "Error interno al procesar la venta.",
      detalle: e.message,
    });
  }
};

export const listarVentas = async (req, res) => {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        detalleventa: true,
        usuario: true,
      },
    });
    return res.status(200).json({ mensaje: "Ventas obtenidas", ventas });
  } catch (error) {
    return res.stauts(500).json({ mensaje: "Ocurrio un error" });
  }
};
