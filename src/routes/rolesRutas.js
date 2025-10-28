import { Router } from "express";
import { listarRoles } from "../controllers/rolesControlador.js";

const rolesRutas = Router();

rolesRutas.route("/").get(listarRoles);

export default rolesRutas;
