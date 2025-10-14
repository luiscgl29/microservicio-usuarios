import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const crearCliente = async (req, res) => {
  try {
    const { nombre, direccion, telefono, saldo, nitCliente } = req.body;
    const cliente = await prisma.cliente.create({
      data: {
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        saldo: Number(saldo),
        nitCliente: nitCliente,
      },
    });
    if (!cliente) {
      return res.status(400).json({ mensaje: "No se registro el cliente" });
    }
    res.status(201).json({ cliente: cliente });
  } catch (error) {
    console.error(error);
  }
};

export const listarClientes = async (req, res) => {
  try {
    const datosClientes = await prisma.cliente.findMany();
    res.status(201).json({ Cliente: datosClientes });
  } catch (error) {
    console.error(error);
  }
};

export const obtenerCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    if (!idCliente) {
      return res.status(400).json({ mensaje: "Se necesita el id del cliente" });
    }
    const datos = await prisma.cliente.findUnique({
      where: {
        codCliente: Number(idCliente),
      },
    });
    res.status(200).json({ datosCliente: datos });
  } catch (error) {
    console.error(error);
  }
};

export const modificarCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const { client } = req.body;
    if (!idCliente || !client) {
      return res
        .status(400)
        .json({ mensaje: "Se necesita el id o el nombre del cliente" });
    }
    const clienteEncontrado = await prisma.cliente.findUnique({
      where: {
        idCliente: Number(idCliente),
      },
    });
    if (!clienteEncontrado) {
      return res.status(400).json({ mensaje: "El cliente no existe" });
    }
    const datos = await prisma.cliente.update({
      where: {
        idCliente: Number(idCliente),
      },
      data: {
        ...clienteEncontrado,
        nombre: client,
      },
    });
    res.status(200).json({ mensaje: "Exitoso" });
  } catch (error) {
    console.error(error);
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    if (!idCliente) {
      return res.status(400).json({ mensaje: "Se necesita el id del cliente" });
    }
    const cliente = await prisma.cliente.delete({
      where: {
        codCliente: Number(idCliente),
      },
    });
    res.status(200).json({ mensaje: "Usuario Eliminado" });
  } catch (error) {
    console.error(error);
  }
};
