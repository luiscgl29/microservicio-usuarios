import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearProducto = async (req, res) => {
  try {
    const { idCategoria, idMarca, nombre, descripcion, precioVenta, estado } =
      req.body;
    const producto = await prisma.producto.create({
      data: {
        idCategoria: Number(idCategoria),
        idMarca: Number(idMarca),
        nombre: nombre,
        descripcion: descripcion,
        precioVenta: precioVenta,
        estado: estado,
      },
    });
    if (!producto) {
      return res.status(400).json({
        mensaje: "No se creo",
      });
    }
    res.status(201).json({ usuario: producto });
  } catch (e) {
    console.error(e);
  }
};

export const listarProducto = async (req, res) => {
  try {
    const datosProductos = await prisma.producto.findMany();
    res.status(200).json({ Producto: datosProductos });
  } catch (e) {
    console.error(e);
  }
};
