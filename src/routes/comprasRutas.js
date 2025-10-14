import { Router } from "express";
import { crearCompra } from "../controllers/comprasControlador.js";

const comprasRutas = Router();

comprasRutas.route("/").post(crearCompra);

export default comprasRutas;
