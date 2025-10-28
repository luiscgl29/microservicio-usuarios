import { PrismaClient, Prisma } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearVenta = async (req, res) => {
  try {
    const { idUsuario, codCliente, totalVenta, detallesventa } = req.body;

    await prisma.$transaction(async (tx) => {
      // Crear venta con codCliente o null (CF por defecto en frontend)
      const ventaGenerado = await tx.venta.create({
        data: {
          idUsuario,
          codCliente: codCliente || null, // Si no hay cliente, se guarda null
          fecha: new Date(),
          totalVenta: new Prisma.Decimal(totalVenta),
        },
      });

      // Crear detalles de venta
      await tx.detalleventa.createMany({
        data: detallesventa.map((detalle) => ({
          ...detalle,
          idVenta: ventaGenerado.idVenta,
          precioUnitario: new Prisma.Decimal(detalle.precioUnitario),
          montoTotal: new Prisma.Decimal(detalle.montoTotal),
        })),
      });

      // Actualizar inventario
      for (const detalle of detallesventa) {
        if (detalle.idProducto) {
          // Reducir stock del producto
          await tx.producto.update({
            where: { idProducto: detalle.idProducto },
            data: {
              cantidadDisponible: {
                decrement: detalle.cantidad,
              },
            },
          });
        }

        if (detalle.idLote) {
          // Reducir cantidad del lote
          await tx.lote.update({
            where: { idLote: detalle.idLote },
            data: {
              cantidadTotal: {
                decrement: detalle.cantidad,
              },
            },
          });
        }
      }

      return res.status(201).json({
        mensaje: "Venta creada exitosamente",
        idVenta: ventaGenerado.idVenta,
      });
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
        cliente: true,
      },
    });
    return res.status(200).json({ mensaje: "Ventas obtenidas", ventas });
  } catch (error) {
    return res.status(500).json({ mensaje: "Ocurrió un error" });
  }
};
