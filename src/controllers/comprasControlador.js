import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const crearCompra = async (req, res) => {
  try {
    const { idUsuario, codProveedor, fecha, detalles, direccion } = req.body;

    // Validación de datos esenciales
    if (!idUsuario || !codProveedor || !detalles || detalles.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Faltan datos esenciales de la compra." });
    }

    // Verificar que los lotes existan
    const lotesAConsultar = detalles.map((d) => Number(d.idLote));
    const lotesExistentes = await prisma.lote.findMany({
      where: { idLote: { in: lotesAConsultar } },
      select: { idLote: true },
    });

    const loteMap = lotesExistentes.reduce((map, l) => {
      map[l.idLote] = true;
      return map;
    }, {});

    for (const detalle of detalles) {
      if (!loteMap[detalle.idLote]) {
        return res.status(400).json({
          mensaje: `Lote no existe: ID ${detalle.idLote}`,
        });
      }
    }

    // ✅ Calcular totalCompra con for...of
    let totalCalculado = 0;
    for (const d of detalles) {
      totalCalculado += Number(d.cantidadComprada) * Number(d.precioCompra);
    }

    // Transacción para asegurar consistencia
    const resultado = await prisma.$transaction(async (tx) => {
      // 1️⃣ Crear compra
      const nuevaCompra = await tx.compra.create({
        data: {
          idUsuario: Number(idUsuario),
          codProveedor: Number(codProveedor),
          fecha: new Date(fecha),
          direccion: direccion || null, // opcional
          totalCompra: 0.0, // si el trigger actualiza el total
          // 👉 o puedes usar totalCalculado si prefieres hacerlo manual
          // totalCompra: totalCalculado,
        },
      });

      // 2️⃣ Crear detalles de la compra
      const promesasDetalles = detalles.map((detalle) =>
        tx.compradetalle.create({
          data: {
            idCompra: nuevaCompra.idCompra, // FK hacia compra
            idLote: Number(detalle.idLote), // FK hacia lote
            precioCompra: Number(detalle.precioCompra),
            cantidadComprada: Number(detalle.cantidadComprada),
          },
        })
      );

      await Promise.all(promesasDetalles);

      // 3️⃣ Retornar compra con relaciones
      return await tx.compra.findUnique({
        where: { idCompra: nuevaCompra.idCompra },
        include: {
          proveedor: true,
          usuario: true,
          compradetalle: true,
        },
      });
    });

    res.status(201).json({
      mensaje: "Compra registrada con éxito.",
      compra: resultado,
    });
  } catch (e) {
    console.error("Error al registrar la compra:", e.message);
    res.status(500).json({
      mensaje: "Error interno al procesar la compra.",
      detalle: e.message,
    });
  }
};
