import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearProducto = async (req, res) => {
  try {
    const {
      idCategoria,
      idMarca,
      nombre,
      descripcion,
      precioVenta,
      cantidadDisponible,
    } = req.body;
    const producto = await prisma.producto.create({
      data: {
        idCategoria: Number(idCategoria),
        idMarca: Number(idMarca),
        nombre: nombre,
        descripcion: descripcion,
        precioVenta: precioVenta,
        cantidadDisponible: Number(cantidadDisponible),
      },
    });
    if (!producto) {
      return res.status(400).json({
        mensaje: "No se creo",
      });
    }
    res.status(201).json({ producto: producto });
  } catch (e) {
    console.error(e);
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    if (!idProducto) {
      return res
        .status(400)
        .json({ mensaje: "Se necesita el id del producto" });
    }
    const datos = await prisma.producto.findUnique({
      where: {
        idProducto: Number(idProducto),
      },
    });
    res.status(200).json({ datosProducto: datos });
  } catch (error) {
    console.error(error);
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

export const modificarProducto = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { producto } = req.body;
    if (!productoId || !producto) {
      return res
        .status(400)
        .json({ mensaje: "Se necesita informacion del producto" });
    }
    const productoEncontrado = await prisma.producto.findUnique({
      where: {
        idProduct: Number(productoId),
      },
    });
    if (!productoEncontrado) {
      return res.status(400).json({ mensaje: "El producto no existe" });
    }
    const datos = await prisma.producto.update({
      where: {
        idProducto: Number(productoId),
      },
      data: {
        ...productoEncontrado,
        nombre: producto,
      },
    });
    res.status(200).json({ producto: "Producto modificado" });
  } catch (error) {
    console.error(error);
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ mensaje: "Se necesita el id" });
    }
    const producto = await prisma.producto.delete({
      where: {
        idProducto: Number(id),
      },
    });
    res.status(200).json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.error(error);
  }
};
