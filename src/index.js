import express from "express";
import cors from "cors";
import { opcionesCors } from "./config/corsOpciones.js";
import empleadosRutas from "./routes/empleadosRutas.js";
import cookieParser from "cookie-parser";
import jwtRutas from "./routes/jwtRutas.js";

const app = express();

app.use(cors(opcionesCors));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

// endpoints
app.use("/empleados", empleadosRutas);
app.use("/jwt", jwtRutas);

app.listen(3000, () => {
  console.log("API en: http://localhost:3000");
});
