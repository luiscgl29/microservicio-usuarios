import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// Controlador para Marca
export const crearMarca = async (req, res) => {
  try {
    const { nombre } = req.body;
    const marca = await prisma.marca.create({
      data: {
        nombre: nombre,
      },
    });
    if (!marca) {
      return res.status(400).json({ mensaje: "No se registro la marca" });
    }
    res.status(200).json({ marca: marca });
  } catch (error) {
    console.error(error);
  }
};

export const listarMarca = async (req, res) => {
  try {
    const datosMarca = await prisma.marca.findMany();
    res.status(200).json({ marcas: datosMarca });
  } catch (error) {
    console.error(error);
  }
};

export const modificarMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!id || !nombre) {
      return res.status(400).json({ mensaje: "Se necesita el id y el nombre" });
    }
    const marcaEncontrada = await prisma.marca.findUnique({
      where: { idMarca: Number(id) },
    });
    if (!marcaEncontrada) {
      return res.status(400).json({ mensaje: "El id de la marca no existe" });
    }
    const marcaActualizada = await prisma.marca.update({
      where: {
        idMarca: Number(id),
      },
      data: {
        nombre: nombre,
      },
    });
    res.status(200).json({ mensaje: "Marca Actualizada", marcaActualizada });
  } catch (error) {
    console.error(error);
  }
};

// Controlador para Categoria
export const crearCategoria = async (req, res) => {
  try {
    const { categoria, descripcion } = req.body;
    const datosCategoria = await prisma.categoria.create({
      data: {
        categoria: categoria,
        descripcion: descripcion,
      },
    });
    if (!datos) {
      return res.status(400).json({ mensaje: "No se registro la categoria" });
    }
    res.status(200).json({ categoria: datosCategoria });
  } catch (error) {
    console.error(error);
  }
};

export const listarCategoria = async (req, res) => {
  try {
    const categoria = await prisma.categoria.findMany();
    res.status(200).json({ categorias: categoria });
  } catch (error) {
    console.error(error);
  }
};

export const modificarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    if (!id) {
      //Pendiente de agregar demas atributos a validacion
      return res
        .status(400)
        .json({ mensaje: "Se necesita el id de la categoria" });
    }
    const categoriaEncontrada = await prisma.categoria.findUnique({
      where: { idCategoria: Number(id) },
    });
    if (!categoriaEncontrada) {
      return res.status(400).json({ mensaje: "La categoria no existe" });
    }
    const categoriaActualizada = await prisma.categoria.update({
      where: {
        idCategoria: Number(id),
      },
      data: {
        nombre: nombre,
        descripcion: descripcion,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
