import { Router } from "express";
import {
  crearProducto,
  listarProducto,
  obtenerProducto,
  modificarProducto,
  eliminarProducto,
} from "../controllers/productosControlador.js";

const productosRutas = Router();

productosRutas.route("/").post(crearProducto).get(listarProducto);

productosRutas
  .route("/:idProducto")
  .get(obtenerProducto)
  .put(modificarProducto)
  .delete(eliminarProducto);

export default productosRutas;
