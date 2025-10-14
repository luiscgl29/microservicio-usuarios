import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearVenta = async (req, res) => {
  try {
    const { idUsuario, codCliente, fecha, metodoPago, detalles } = req.body;

    if (!idUsuario || !codCliente || !detalles || detalles.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Faltan datos esenciales de la venta." });
    }

    // ==========================================================
    // PASO 1: VERIFICACIÓN DE STOCK (EVITAR ERRORES DE DB)
    // ==========================================================
    const productosAConsultar = detalles.map((d) => Number(d.idProducto));
    const stockActual = await prisma.producto.findMany({
      where: { idProducto: { in: productosAConsultar } },
      select: { idProducto: true, cantidadDisponible: true, nombre: true },
    });

    const stockMap = stockActual.reduce((map, p) => {
      map[p.idProducto] = {
        disponible: p.cantidadDisponible,
        nombre: p.nombre,
      };
      return map;
    }, {});

    for (const detalle of detalles) {
      const id = Number(detalle.idProducto);
      const cantidadVendida = Number(detalle.cantidad);

      if (!stockMap[id] || stockMap[id].disponible < cantidadVendida) {
        // Detener la operación y responder con error claro
        return res.status(400).json({
          mensaje: "Error de stock.",
          detalle: `Stock insuficiente para el producto: ${
            stockMap[id]?.nombre || "ID " + id
          }. Solicitado: ${cantidadVendida}, Disponible: ${
            stockMap[id]?.disponible || 0
          }`,
        });
      }
    }
    // Si la verificación pasa, continuamos con la inserción

    // ==========================================================
    // PASO 2: INSERCIÓN EN TRANSACCIÓN
    // ==========================================================
    const resultado = await prisma.$transaction(async (tx) => {
      // 2.1. Crear la Venta (El totalVenta se inicializa en 0 y el trigger lo actualiza)
      const nuevaVenta = await tx.venta.create({
        data: {
          idUsuario: Number(idUsuario),
          codCliente: Number(codCliente),
          fecha: new Date(fecha),
          totalVenta: 0.0,
          metodoPago: metodoPago,
        },
      });

      // 2.2. Crear los Detalles de Venta (El trigger se activa en este paso)
      const promesasDetalles = detalles.map((detalle) => {
        return tx.detalleventa.create({
          data: {
            idVenta: nuevaVenta.idVenta,
            idLote: Number(detalle.idLote) || null,
            idProducto: Number(detalle.idProducto) || null,
            cantidad: Number(detalle.cantidad),
            precioUnitario: Number(detalle.precioUnitario),
            descuento: Number(detalle.descuento || 0),
            montoTotal: Number(detalle.montoTotal),
            ivaProducto: Number(detalle.ivaProducto || 0),
          },
        });
      });

      await Promise.all(promesasDetalles);

      // 2.3. Retornar la venta final (se obtiene la venta con el total actualizado por el trigger)
      const ventaFinal = await tx.venta.findUnique({
        where: { idVenta: nuevaVenta.idVenta },
      });

      return ventaFinal;
    });

    res
      .status(201)
      .json({ mensaje: "Venta registrada con éxito.", venta: resultado });
  } catch (e) {
    console.error("Error al registrar la venta:", e.message);
    res.status(500).json({
      mensaje: "Error interno al procesar la venta.",
      detalle: e.message,
    });
  }
};
