import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearProveedor = async (req, res) => {
  try {
    const { nombreEmpresa, telefono } = req.body;
    const proveedor = await prisma.proveedor.create({
      data: {
        nombreEmpresa: nombreEmpresa,
        telefono: telefono,
      },
    });
    if (!proveedor) {
      return res.status(400).json({ mensaje: "No se registro el proveedor" });
    }
    res.status(201).json({ proveedor: proveedor });
  } catch (error) {
    console.error(error);
  }
};

export const obtenerProveedor = async (req, res) => {
  try {
    const { idProveedor } = req.params;
    if (!idProveedor) {
      return res
        .status(400)
        .json({ mensaje: "Se necesita el id del proveedor" });
    }
    const datos = await prisma.proveedor.findUnique({
      where: {
        codProveedor: idProveedor,
      },
    });
    res.status(200).json({ datosProveedor: datos });
  } catch (error) {
    console.error(error);
  }
};

export const listarProveedor = async (req, res) => {
  try {
    const datosProveedor = await prisma.proveedor.findMany();
    res.status(200).json({ Proveedor: datosProveedor });
  } catch (error) {
    console.error(error);
  }
};

export const modificarProveedor = async (req, res) => {
  try {
    const { idProveedor } = req.params;
    const { provider } = req.body;
    if (!idProveedor || !provider) {
      return res.status(400).json({ mensaje: "Se necesita el id" });
    }
    const proveedorEncontrado = await prisma.proveedor.findUnique({
      where: {
        codProveedor: Number(idProveedor),
      },
    });
    if (!proveedorEncontrado) {
      return res.status(400).json({ mensaje: "No existe el proveedor" });
    }
    const datos = await prisma.proveedor.update({
      where: {
        codProveedor: Number(idProveedor),
      },
      data: {
        ...proveedorEncontrado,
        nombreEmpresa: provider,
      },
    });
    res.status(200).json({ mensaje: "Proveedor modificado" });
  } catch (error) {
    console.error(error);
  }
};

export const eliminarProveedor = async (req, res) => {
  try {
    const { idProveedor } = req.params;
    if (!idProveedor) {
      return res
        .status(400)
        .json({ mensaje: "Se necesita el id del proveedor" });
    }
    const proveedor = await prisma.proveedor.delete({
      where: {
        codProveedor: Number(idProveedor),
      },
    });
    res.status(200).json({ mensaje: "Proveedor eliminado" });
  } catch (error) {
    console.error(error);
  }
};
