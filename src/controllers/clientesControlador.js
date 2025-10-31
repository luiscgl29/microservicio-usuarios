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
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ mensaje: "Se necesita el id del cliente" });
    }
    const datos = await prisma.cliente.findUnique({
      where: {
        codCliente: Number(id),
      },
    });
    res.status(200).json({ datosCliente: datos });
  } catch (error) {
    console.error(error);
  }
};

export const modificarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, telefono, saldo, nitCliente } = req.body;

    if (!id) {
      return res.status(400).json({ mensaje: "Se necesita el id del cliente" });
    }

    const clienteEncontrado = await prisma.cliente.findUnique({
      where: {
        codCliente: Number(id), // Cambiar a codCliente
      },
    });

    if (!clienteEncontrado) {
      return res.status(400).json({ mensaje: "El cliente no existe" });
    }

    const datos = await prisma.cliente.update({
      where: {
        codCliente: Number(id), // Cambiar a codCliente
      },
      data: {
        nombre,
        direccion,
        telefono,
        saldo: Number(saldo),
        nitCliente,
      },
    });

    res.status(200).json({ mensaje: "Exitoso", cliente: datos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar cliente" });
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
