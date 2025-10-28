import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const crearEmpleado = async (req, res) => {
  try {
    const { idRol, nombre, user, contrasenia, correo, salario } = req.body;
    const saltRounds = 10;
    const hash = await bcrypt.hash(contrasenia, saltRounds);

    const usuario = await prisma.usuario.create({
      data: {
        idRol: Number(idRol),
        nombre: nombre,
        user: user,
        contrasenia: hash,
        correo: correo,
        salario: salario,
      },
    });
    if (!usuario) {
      return res.status(400).json({ mensaje: "No se registro el usuario" });
    }
    res.status(201).json({ usuario: usuario });
  } catch (e) {
    console.error(e);
  }
};

export const obtenerEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ mensaje: "Necesita agregar id" });
    }
    const datos = await prisma.usuario.findUnique({
      where: {
        idUsuario: Number(id),
      },
    });
    res.status(200).json({ datosUsuario: datos });
  } catch (error) {
    console.error(error);
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
    const { id } = req.params;
    const { idRol, nombre, user, correo, salario } = req.body;

    if (!id) {
      return res.status(400).json({ mensaje: "Se necesita el id" });
    }

    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: {
        idUsuario: Number(id),
      },
    });

    if (!usuarioEncontrado) {
      return res.status(400).json({ mensaje: "No existe" });
    }

    const datos = await prisma.usuario.update({
      where: {
        idUsuario: Number(id),
      },
      data: {
        idRol: idRol ? Number(idRol) : usuarioEncontrado.idRol,
        nombre: nombre || usuarioEncontrado.nombre,
        user: user || usuarioEncontrado.user,
        correo: correo || usuarioEncontrado.correo,
        salario: salario ? Number(salario) : usuarioEncontrado.salario,
      },
    });

    res.status(200).json({ mensaje: "Exitoso", usuario: datos });
  } catch (e) {
    console.log(e);
    res.status(500).json({ mensaje: "Error al actualizar empleado" });
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
  } catch (error) {
    console.error(error);
  }
};
