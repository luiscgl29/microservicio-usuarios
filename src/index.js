import express from "express";
import cors from "cors";
import { opcionesCors } from "./config/corsOpciones.js";
import { verificarJwt } from "./middlewares/jwtMiddleware.js";
import empleadosRutas from "./routes/empleadosRutas.js";
import cookieParser from "cookie-parser";
import jwtRutas from "./routes/jwtRutas.js";
import { getUsuario } from "./controllers/usuario.js";
import productosRutas from "./routes/productosRutas.js";
import clientesRutas from "./routes/clientesRutas.js";
import proveedoresRutas from "./routes/proveedoresRutas.js";
import ventasRutas from "./routes/ventasRutas.js";
import comprasRutas from "./routes/comprasRutas.js";
import lotesRutas from "./routes/lotesRutas.js";

const app = express();

app.use(cors(opcionesCors));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

// endpoints
app.use("/login", jwtRutas);
app.use(verificarJwt);
app.use("/empleados", empleadosRutas);
app.use("/usuario", getUsuario);
app.use("/productos", productosRutas);
app.use("/clientes", clientesRutas);
app.use("/proveedores", proveedoresRutas);
app.use("/ventas", ventasRutas);
app.use("/compras", comprasRutas);
app.use("/lotes", lotesRutas);

app.listen(3000, () => {
  console.log("API en: http://localhost:3000");
});
