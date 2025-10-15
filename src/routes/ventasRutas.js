import { Router } from "express";
import { crearVenta, listarVentas } from "../controllers/ventasControlador.js";

const ventasRutas = Router();

ventasRutas.route("/").post(crearVenta).get(listarVentas);

export default ventasRutas;
