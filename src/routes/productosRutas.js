import { Router } from "express";
import {
  crearProducto,
  listarProducto,
  obtenerProducto,
  modificarProducto,
  eliminarProducto,
} from "../controllers/productosControlador.js";
import {
  crearCategoria,
  listarCategoria,
  modificarCategoria,
  crearMarca,
  listarMarca,
  modificarMarca,
} from "../controllers/marcaycategoriaControlador.js";

const productosRutas = Router();

productosRutas.route("/").post(crearProducto).get(listarProducto);

productosRutas.route("/marca").post(crearMarca).get(listarMarca);
productosRutas.route("/marca/:id").put(modificarMarca);

productosRutas.route("/categoria").post(crearCategoria).get(listarCategoria);
productosRutas.route("/categoria/:id").put(modificarCategoria);

productosRutas
  .route("/:id")
  .get(obtenerProducto)
  .put(modificarProducto)
  .delete(eliminarProducto);

export default productosRutas;
