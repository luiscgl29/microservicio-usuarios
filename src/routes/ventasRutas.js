import { Router } from "express";
import { crearVenta } from "../controllers/ventasControlador.js";

const ventasRutas = Router();

ventasRutas.route("/").post(crearVenta);

export default ventasRutas;
