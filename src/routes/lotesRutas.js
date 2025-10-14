import { Router } from "express";
import { listarLotes } from "../controllers/lotesControlador.js";

const lotesRutas = Router();

lotesRutas.route("/").get(listarLotes);

export default lotesRutas;
