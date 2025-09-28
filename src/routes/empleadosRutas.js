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
  .delete(eliminarEmpleado);
empleadosRutas
  .route("/individual/:empleadoId")
  .get(obtenerEmpleado)
  .put(modificarEmpleado);

export default empleadosRutas;
