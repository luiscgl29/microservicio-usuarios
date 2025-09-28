import { Router } from "express";
import {
  crearProducto,
  listarProducto,
} from "../controllers/productosControlador.js";

const productosRutas = Router();

productosRutas.route("/").post(crearProducto).get(listarProducto);

export default productosRutas;
