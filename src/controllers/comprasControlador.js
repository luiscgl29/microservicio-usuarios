import { PrismaClient, Prisma } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const crearCompra = async (req, res) => {
  try {
    const { idUsuario, codProveedor, totalCompra, compradetalle } = req.body;

    // Validaciones básicas
    if (!codProveedor) {
      return res.status(400).json({
        mensaje: "El proveedor es obligatorio",
      });
    }

    if (!compradetalle || compradetalle.length === 0) {
      return res.status(400).json({
        mensaje: "Debe incluir al menos un detalle de compra",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Crear compra con proveedor
      const compraGenerada = await tx.compra.create({
        data: {
          idUsuario,
          codProveedor,
          fecha: new Date(),
          totalCompra: new Prisma.Decimal(totalCompra),
        },
      });

      // Crear detalles de compra
      // ⚠️ El trigger se ejecutará automáticamente y actualizará el inventario
      await tx.compradetalle.createMany({
        data: compradetalle.map((detalle) => ({
          idCompra: compraGenerada.idCompra,
          idLote: detalle.idLote,
          cantidadComprada: detalle.cantidadComprada,
          precioCompra: new Prisma.Decimal(detalle.precioCompra),
        })),
      });

      return res.status(201).json({
        mensaje: "Compra registrada exitosamente",
        idCompra: compraGenerada.idCompra,
      });
    });
  } catch (error) {
    console.error("Error al registrar la compra:", error.message);
    return res.status(500).json({
      mensaje: "Error interno al procesar la compra",
      detalle: error.message,
    });
  }
};

export const listarCompras = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        compradetalle: true,
        usuario: true,
        proveedor: true,
      },
    });
    return res.status(200).json({ mensaje: "Compras obtenidas", compras });
  } catch (error) {
    return res.status(500).json({ mensaje: "Ocurrió un error" });
  }
};
