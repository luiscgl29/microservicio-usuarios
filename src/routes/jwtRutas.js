import { Router } from "express";
import {
  cerrarSesion,
  iniciarSesion,
  getIdentificacion,
} from "../controllers/jwtControlador.js";
import { verificarJwt } from "../middlewares/jwtMiddleware.js";

const jwtRutas = Router();

jwtRutas.route("/").post(iniciarSesion).get(cerrarSesion);

jwtRutas.route("/identificacion").get(verificarJwt, getIdentificacion);

export default jwtRutas;
