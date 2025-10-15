import { Router } from "express";
import { cerrarSesion, iniciarSesion } from "../controllers/jwtControlador.js";

const jwtRutas = Router();

// prettier-ignore
jwtRutas
  .route("/")
    .post(iniciarSesion)
    .get(cerrarSesion);

export default jwtRutas;
