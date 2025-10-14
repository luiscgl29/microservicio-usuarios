import { Router } from "express";
import {
  crearProveedor,
  listarProveedor,
  obtenerProveedor,
  modificarProveedor,
  eliminarProveedor,
} from "../controllers/proveedoresControlador.js";

const proveedoresRutas = Router();

proveedoresRutas.route("/").post(crearProveedor).get(listarProveedor);
proveedoresRutas
  .route("/:idProveedor")
  .get(obtenerProveedor)
  .put(modificarProveedor)
  .delete(eliminarProveedor);

export default proveedoresRutas;
