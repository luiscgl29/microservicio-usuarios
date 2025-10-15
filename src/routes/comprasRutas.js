import { Router } from "express";
import {
  crearCompra,
  listarCompras,
} from "../controllers/comprasControlador.js";

const comprasRutas = Router();

comprasRutas.route("/").post(crearCompra).get(listarCompras);

export default comprasRutas;
