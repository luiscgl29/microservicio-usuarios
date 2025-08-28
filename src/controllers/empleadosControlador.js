import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearEmpleado = async (req, res) => {
  try {
    const { nombre, contrasenia, idRol } = req.body;
    const usuario = await prisma.usuario.create({
      data: {
        nombre: nombre,
        contrasenia: contrasenia,
        idRol: idRol,
      },
    });
    if (!usuario) {
      return res.status(400).json({ mensaje: "No se creo" });
    }
    res.status(201).json({ usuario: usuario });
  } catch (e) {
    console.error(e);
  }
};

export const obtenerEmpleado = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensaje: "Necesita agregar id" });
    }
    const datos = await prisma.usuario.findUnique({
      where: {
        idUsuario: id,
      },
    });
    res.status(200).json({ datosUsuario: datos });
  } catch {
    console.error(e);
  }
};

export const listarEmpleado = async (req, res) => {
  try {
    const datosUsuarios = await prisma.usuario.findMany();
    res.status(200).json({ Usuario: datosUsuarios });
  } catch (e) {
    console.error(e);
  }
};

export const modificarEmpleado = async (req, res) => {
  try {
    const { id, nombre } = req.body;
    if (!id || !nombre) {
      return res.status(400).json({ mensaje: "Se necesita el id" });
    }
    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: {
        idUsuario: id,
      },
    });
    if (!usuarioEncontrado) {
      return res.status(400).json({ mensaje: "No existe" });
    }
    const datos = await prisma.usuario.update({
      where: {
        idUsuario: id,
      },
      data: {
        ...usuarioEncontrado,
        nombre: nombre,
      },
    });
    res.status(200).json({ mensaje: "Exitoso" });
  } catch (e) {
    console.log(e);
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensaje: "Se necesita el id" });
    }
    const usuario = await prisma.usuario.delete({
      where: {
        idUsuario: id,
      },
    });
    res.status(200).json({ mensaje: "Usuario eliminado" });
  } catch (e) {}
};
