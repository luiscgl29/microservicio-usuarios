import { Router } from "express";
import {
  crearEmpleado,
  listarEmpleado,
  obtenerEmpleado,
  modificarEmpleado,
  eliminarEmpleado,
} from "../controllers/empleadosControlador.js";

const empleadosRutas = Router();

empleadosRutas
  .route("/")
  .post(crearEmpleado)
  .get(listarEmpleado)
  .put(modificarEmpleado)
  .delete(eliminarEmpleado);
empleadosRutas.route("/buscarIndividual").post(obtenerEmpleado);

export default empleadosRutas;
