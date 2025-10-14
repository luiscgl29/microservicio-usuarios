import { Router } from "express";
import {
  crearCliente,
  listarClientes,
  obtenerCliente,
  modificarCliente,
  eliminarCliente,
} from "../controllers/clientesControlador.js";

const clientesRutas = Router();

clientesRutas.route("/").post(crearCliente).get(listarClientes);
clientesRutas
  .route("/:idCliente")
  .get(obtenerCliente)
  .put(modificarCliente)
  .delete(eliminarCliente);

export default clientesRutas;
