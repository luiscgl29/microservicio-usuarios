import express from "express";
import cors from "cors";
import { opcionesCors } from "./config/corsOpciones.js";
import { verificarJwt } from "./middlewares/jwtMiddleware.js";
import empleadosRutas from "./routes/empleadosRutas.js";
import cookieParser from "cookie-parser";
import jwtRutas from "./routes/jwtRutas.js";
import productosRutas from "./routes/productosRutas.js";
import clientesRutas from "./routes/clientesRutas.js";
import proveedoresRutas from "./routes/proveedoresRutas.js";
import ventasRutas from "./routes/ventasRutas.js";
import comprasRutas from "./routes/comprasRutas.js";
import lotesRutas from "./routes/lotesRutas.js";
import usuarioRouter from "./controllers/usuario.js";
import { verificarPermisos } from "./middlewares/verificarPermisos.js";

const app = express();

app.use(cors(opcionesCors));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

// endpoints
app.use("/login", jwtRutas);

// jwt
app.use(verificarJwt);
// solo para saber quien es
app.use("/usuario", usuarioRouter);

// verificar permisos
// solo administrador
app.use("/empleados", verificarPermisos(["Administrador"]), empleadosRutas);

// bodeguero
app.use(
  "/productos",
  verificarPermisos(["Administrador", "Bodeguero"]),
  productosRutas
);
app.use(
  "/lotes",
  verificarPermisos(["Administrador", "Bodeguero"]),
  lotesRutas
);
app.use(
  "/proveedores",
  verificarPermisos(["Administrador", "Bodeguero"]),
  proveedoresRutas
);
app.use(
  "/compras",
  verificarPermisos(["Administrador", "Bodeguero"]),
  comprasRutas
);

// vendedor
app.use(
  "/clientes",
  verificarPermisos(["Administrador", "Vendedor"]),
  clientesRutas
);
app.use(
  "/ventas",
  verificarPermisos(["Administrador", "Vendedor"]),
  ventasRutas
);

app.listen(3000, () => {
  console.log("API en: http://localhost:3000");
});
