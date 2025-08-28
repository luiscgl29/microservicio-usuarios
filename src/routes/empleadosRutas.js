import { Router } from "express";
import {
  crearEmpleado,
  listarEmpleado,
  obtenerEmpleado,
  modificarEmpleado,
  eliminarEmpleado,
} from "../controllers/empleadosControlador.js";
import { verificarJwt } from "../middlewares/jwtMiddleware.js";

const empleadosRutas = Router();

empleadosRutas
  .route("/")
  .post(crearEmpleado)
  .get(listarEmpleado)
  .put(modificarEmpleado)
  .delete(eliminarEmpleado);
empleadosRutas.route("/buscarIndividual").post(verificarJwt, obtenerEmpleado);

export default empleadosRutas;
