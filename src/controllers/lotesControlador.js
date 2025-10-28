import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// Crear lote
export const crearLote = async (req, res) => {
  try {
    const {
      idProducto,
      cantidadTotal,
      precioCompra,
      precioVenta,
      nombrePaquete,
    } = req.body;

    if (
      !idProducto ||
      !cantidadTotal ||
      !precioCompra ||
      !precioVenta ||
      !nombrePaquete
    ) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Verificar que el producto existe
    const productoExiste = await prisma.producto.findUnique({
      where: { idProducto: Number(idProducto) },
    });

    if (!productoExiste) {
      return res.status(404).json({ mensaje: "El producto no existe" });
    }

    const lote = await prisma.lote.create({
      data: {
        idProducto: Number(idProducto),
        cantidadTotal: Number(cantidadTotal),
        precioCompra: Number(precioCompra),
        precioVenta: Number(precioVenta),
        nombrePaquete: nombrePaquete,
      },
      include: {
        producto: true,
      },
    });

    res.status(201).json({ lote: lote });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error al crear el lote" });
  }
};

// Listar todos los lotes
export const listarLotes = async (req, res) => {
  try {
    const lotes = await prisma.lote.findMany({
      include: {
        producto: {
          include: {
            categoria: true,
            marca: true,
          },
        },
      },
      orderBy: {
        idLote: "desc",
      },
    });

    res.status(200).json({ Lotes: lotes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error al listar los lotes" });
  }
};

// Obtener un lote por ID
export const obtenerLote = async (req, res) => {
  try {
    const { loteId } = req.params;

    if (!loteId) {
      return res.status(400).json({ mensaje: "Se necesita el ID del lote" });
    }

    const lote = await prisma.lote.findUnique({
      where: {
        idLote: Number(loteId),
      },
      include: {
        producto: {
          include: {
            categoria: true,
            marca: true,
          },
        },
      },
    });

    if (!lote) {
      return res.status(404).json({ mensaje: "Lote no encontrado" });
    }

    res.status(200).json({ datosLote: lote });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error al obtener el lote" });
  }
};

// Editar lote
export const editarLote = async (req, res) => {
  try {
    const { loteId } = req.params;
    const {
      idProducto,
      cantidadTotal,
      precioCompra,
      precioVenta,
      nombrePaquete,
    } = req.body;

    if (!loteId) {
      return res.status(400).json({ mensaje: "Se necesita el ID del lote" });
    }

    // Verificar que el lote existe
    const loteExiste = await prisma.lote.findUnique({
      where: { idLote: Number(loteId) },
    });

    if (!loteExiste) {
      return res.status(404).json({ mensaje: "El lote no existe" });
    }

    // Si se cambia el producto, verificar que existe
    if (idProducto && idProducto !== loteExiste.idProducto) {
      const productoExiste = await prisma.producto.findUnique({
        where: { idProducto: Number(idProducto) },
      });

      if (!productoExiste) {
        return res.status(404).json({ mensaje: "El producto no existe" });
      }
    }

    const loteActualizado = await prisma.lote.update({
      where: {
        idLote: Number(loteId),
      },
      data: {
        idProducto: idProducto ? Number(idProducto) : loteExiste.idProducto,
        cantidadTotal: cantidadTotal
          ? Number(cantidadTotal)
          : loteExiste.cantidadTotal,
        precioCompra: precioCompra
          ? Number(precioCompra)
          : loteExiste.precioCompra,
        precioVenta: precioVenta ? Number(precioVenta) : loteExiste.precioVenta,
        nombrePaquete: nombrePaquete || loteExiste.nombrePaquete,
      },
      include: {
        producto: true,
      },
    });

    res.status(200).json({
      mensaje: "Lote actualizado exitosamente",
      lote: loteActualizado,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error al editar el lote" });
  }
};
