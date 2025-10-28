import express from "express";
import {
  crearLote,
  listarLotes,
  obtenerLote,
  editarLote,
} from "../controllers/lotesControlador.js";

const router = express.Router();

// prettier-ignore
router
  .route("/")
    .post(crearLote)
    .get(listarLotes)

router.route("/:loteId").get(obtenerLote).put(editarLote);

export default router;
