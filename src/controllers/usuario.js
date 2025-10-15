import { PrismaClient } from "../generated/prisma/index.js";
import { Router } from "express";

const prisma = new PrismaClient();

export const getUsuario = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ mensaje: "Usted esta logeado", usuario: req.payload });
  } catch (error) {
    console.error(error);
  }
};

const usuarioRouter = Router();

usuarioRouter.route("/").get(getUsuario);
export default usuarioRouter;
